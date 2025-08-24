 const express = require('express');
 const mysql = require('mysql2/promise');
 const cors = require('cors');
 const bodyParser = require('body-parser');
 const puppeteer = require('puppeteer');
 const { Document, Packer, Paragraph, TextRun, ImageRun } = require('docx');
 const fs = require('fs').promises;
 const path = require('path');
 require('dotenv').config();
 
 const app = express();
 
 // Middleware
 app.use(cors());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(path.join(__dirname, 'public')));
 
 // Database connection pool
 const dbPool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
 });
 
 // --- Database Initialization ---
 async function initializeDatabase() {
   try {
     const connection = await dbPool.getConnection();
     console.log('Connected to MySQL database.');
 
     // Read and execute schema file
     const schema = await fs.readFile(path.join(__dirname, 'database_schema.sql'), 'utf-8');
     const queries = schema.split(';').filter(query => query.trim() !== '');
 
     for (const query of queries) {
       await connection.query(query);
     }
 
     console.log('Database schema and initial data loaded successfully.');
     connection.release();
   } catch (error) {
     console.error('Error initializing database:', error);
     // Exit if the database cannot be initialized
     process.exit(1);
   }
 }
 
 // --- API Endpoints ---
 
 // Get all employees
 app.get('/api/employees', async (req, res) => {
   try {
     const [rows] = await dbPool.query('SELECT * FROM employees ORDER BY name');
     res.json(rows);
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch employees' });
   }
 });
 
 // Get all letters
 app.get('/api/letters', async (req, res) => {
   try {
     const [rows] = await dbPool.query(`
       SELECT l.*, e.name as employee_name, e.department 
       FROM appreciation_letters l
       JOIN employees e ON l.employee_id = e.employee_id
       ORDER BY l.created_at DESC
     `);
     res.json(rows);
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch letters' });
   }
 });
 
 // Generate Letter
 app.post('/api/generate', async (req, res) => {
   const { employee_id, subject, reason, format_selected } = req.body;
 
   if (!employee_id || !subject || !reason) {
     return res.status(400).json({ error: 'Missing required fields.' });
   }
 
   try {
     const [companyDetails] = await dbPool.query('SELECT * FROM company_details LIMIT 1');
     const [employee] = await dbPool.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
 
     if (!companyDetails.length || !employee.length) {
       return res.status(404).json({ error: 'Company or employee details not found.' });
     }
 
     const company = companyDetails[0];
     const emp = employee[0];
     const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
 
     const letterHtml = `
       <html>
         <head>
           <style>
             body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 50px; }
             .header { text-align: center; }
             .header img { width: 200px; }
             .header h1 { margin: 0; }
             .content { margin-top: 40px; }
             .signature-section { margin-top: 50px; }
           </style>
         </head>
         <body>
           <div class="header">
             <img src="http://localhost:${process.env.PORT}${company.logo_url}" alt="Company Logo">
             <h1>${company.name}</h1>
             <p>${company.address}</p>
           </div>
           <hr>
           <div class="content">
             <p><strong>Date:</strong> ${currentDate}</p>
             <p><strong>To,</strong><br>${emp.name}<br>${emp.department}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p>Dear ${emp.name},</p>
             <p>${reason}</p>
             <p>We are proud to have you as part of our team and look forward to your continued contributions.</p>
             <div class="signature-section">
               <p>Sincerely,</p>
               <img src="http://localhost:${process.env.PORT}${company.founder_signature_url}" alt="Signature" style="width: 150px;">
               <p><strong>${company.founder_name}</strong><br>Founder, ${company.name}</p>
             </div>
           </div>
         </body>
       </html>
     `;
 
     const [result] = await dbPool.query(
       'INSERT INTO appreciation_letters (employee_id, subject, reason, generated_letter, format_selected) VALUES (?, ?, ?, ?, ?)',
       [employee_id, subject, reason, letterHtml, format_selected]
     );
 
     res.json({ success: true, letterId: result.insertId, html: letterHtml });
 
   } catch (error) {
     console.error('Error generating letter:', error);
     res.status(500).json({ error: 'Failed to generate letter' });
   }
 });
 
 // Download PDF
 app.get('/api/download/pdf/:letterId', async (req, res) => {
   try {
     const { letterId } = req.params;
     const [[letter]] = await dbPool.query('SELECT * FROM appreciation_letters WHERE letter_id = ?', [letterId]);
     if (!letter) return res.status(404).send('Letter not found');
 
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     await page.setContent(letter.generated_letter, { waitUntil: 'networkidle0' });
     const pdf = await page.pdf({ format: 'A4', printBackground: true });
     await browser.close();
 
     res.contentType('application/pdf');
     res.send(pdf);
   } catch (error) {
     res.status(500).send('Error generating PDF');
   }
 });
 
 // Download DOCX
 app.get('/api/download/docx/:letterId', async (req, res) => {
    try {
        const { letterId } = req.params;
        const [[letter]] = await dbPool.query(
            `SELECT l.*, e.name as employee_name, e.department, c.*
             FROM appreciation_letters l
             JOIN employees e ON l.employee_id = e.employee_id
             JOIN company_details c ON c.company_id = 1
             WHERE l.letter_id = ?`, [letterId]
        );

        if (!letter) return res.status(404).send('Letter not found');

        const logoPath = path.join(__dirname, 'public', letter.logo_url);
        const signaturePath = path.join(__dirname, 'public', letter.founder_signature_url);

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new ImageRun({
                            data: await fs.readFile(logoPath),
                            transformation: { width: 200, height: 100 },
                        })],
                        alignment: 'center',
                    }),
                    new Paragraph({ text: letter.name, heading: 'Title', alignment: 'center' }),
                    new Paragraph({ text: letter.address, alignment: 'center' }),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ text: `Date: ${new Date(letter.created_at).toLocaleDateString()}` }),
                    new Paragraph({ text: `To,` }),
                    new Paragraph({ text: letter.employee_name }),
                    new Paragraph({ text: letter.department }),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ text: `Subject: ${letter.subject}`, bold: true }),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ text: `Dear ${letter.employee_name},` }),
                    new Paragraph({ text: letter.reason }),
                    new Paragraph({ text: 'We are proud to have you as part of our team and look forward to your continued contributions.' }),
                    new Paragraph({ text: '' }), // Spacer
                    new Paragraph({ text: 'Sincerely,' }),
                    new Paragraph({
                        children: [new ImageRun({
                            data: await fs.readFile(signaturePath),
                            transformation: { width: 150, height: 75 },
                        })],
                    }),
                    new Paragraph({ text: letter.founder_name, bold: true }),
                    new Paragraph({ text: `Founder, ${letter.name}` }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating DOCX:', error);
        res.status(500).send('Error generating DOCX');
    }
 });
 
 // --- Server Start ---
 const PORT = process.env.PORT || 3001;
 app.listen(PORT, async () => {
   await initializeDatabase();
   console.log(`Server is running on http://localhost:${PORT}`);
 });