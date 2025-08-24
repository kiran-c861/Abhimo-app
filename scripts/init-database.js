const mysql = require('mysql2');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '' // Update with your MySQL password
});

// Create database and tables
async function initializeDatabase() {
  try {
    console.log('Connecting to MySQL...');
    
    // Create database
    await executeQuery('CREATE DATABASE IF NOT EXISTS abhimo_appreciation_db');
    console.log('Database created/verified successfully');
    
    // Use the database
    await executeQuery('USE abhimo_appreciation_db');
    
    // Create employees table
    const createEmployeesTable = `
      CREATE TABLE IF NOT EXISTS employees (
        employee_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createEmployeesTable);
    console.log('Employees table created successfully');
    
    // Create company_details table
    const createCompanyDetailsTable = `
      CREATE TABLE IF NOT EXISTS company_details (
        company_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        logo_url VARCHAR(500),
        founder_name VARCHAR(255) NOT NULL,
        founder_signature_url VARCHAR(500),
        seal_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createCompanyDetailsTable);
    console.log('Company details table created successfully');
    
    // Create appreciation_letters table
    const createAppreciationLettersTable = `
      CREATE TABLE IF NOT EXISTS appreciation_letters (
        letter_id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        subject VARCHAR(500) NOT NULL,
        reason TEXT NOT NULL,
        generated_letter TEXT NOT NULL,
        format_selected VARCHAR(50) DEFAULT 'both',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
      )
    `;
    await executeQuery(createAppreciationLettersTable);
    console.log('Appreciation letters table created successfully');
    
    // Insert default company details for Abhimo Technologies
    const insertCompanyDetails = `
      INSERT IGNORE INTO company_details 
      (company_id, name, address, founder_name, logo_url, founder_signature_url, seal_url) 
      VALUES (
        1,
        'Abhimo Technologies',
        'Innovation Drive, Tech Park, Bangalore - 560001, Karnataka, India',
        'Rajesh Kumar',
        '/images/abhimo-logo.png',
        '/images/founder-signature.png',
        '/images/company-seal.png'
      )
    `;
    await executeQuery(insertCompanyDetails);
    console.log('Default company details inserted successfully');
    
    // Insert some sample employees for testing
    const sampleEmployees = [
      ['John Doe', 'Software Development', 'john.doe@abhimo.com'],
      ['Jane Smith', 'Quality Assurance', 'jane.smith@abhimo.com'],
      ['Mike Johnson', 'DevOps', 'mike.johnson@abhimo.com'],
      ['Sarah Wilson', 'UI/UX Design', 'sarah.wilson@abhimo.com'],
      ['David Brown', 'Project Management', 'david.brown@abhimo.com']
    ];
    
    for (const employee of sampleEmployees) {
      const insertEmployee = `
        INSERT IGNORE INTO employees (name, department, email) 
        VALUES (?, ?, ?)
      `;
      await executeQuery(insertEmployee, employee);
    }
    console.log('Sample employees inserted successfully');
    
    console.log('\n✅ Database initialization completed successfully!');
    console.log('📊 Database: abhimo_appreciation_db');
    console.log('📋 Tables created: employees, company_details, appreciation_letters');
    console.log('👥 Sample data inserted for testing');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    connection.end();
  }
}

// Helper function to execute queries with promises
function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Run the initialization
initializeDatabase();