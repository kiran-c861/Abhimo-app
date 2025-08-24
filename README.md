# Abhimo Technologies - Appreciation Letter Generator

A comprehensive web application for generating, managing, and downloading employee appreciation letters with professional formatting and database storage.

## Features

### 🎯 Core Functionality
- **Letter Generation**: Create personalized appreciation letters with company branding
- **Employee Management**: Add and manage employee records
- **Letter Management**: View, edit, and organize generated letters
- **Multi-format Export**: Download letters as PDF or Word documents
- **Database Storage**: Persistent storage of all letters and employee data

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, modern interface with Abhimo Technologies branding
- **Intuitive Navigation**: Tab-based interface for easy access to all features
- **Real-time Preview**: Instant preview of generated letters before download

### �� Technical Features
- **Full-stack Architecture**: Node.js/Express backend with MySQL database
- **RESTful API**: Clean API endpoints for all operations
- **Document Generation**: High-quality PDF and Word document creation
- **Search Functionality**: Quick search through letters and employees
- **Error Handling**: Comprehensive error handling and user feedback

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database for data persistence
- **Puppeteer** for PDF generation
- **docx** library for Word document creation

### Frontend
- **HTML5** with semantic markup
- **CSS3** with modern styling and animations
- **Vanilla JavaScript** for dynamic functionality
- **Font Awesome** icons for enhanced UI

### Database Schema
- **employees** table: Employee information
- **company_details** table: Company branding and details
- **appreciation_letters** table: Generated letters with relationships

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm (Node Package Manager)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Database Setup
1. Start your MySQL server
2. Update database credentials in `server.js` and `scripts/init-database.js`
3. Initialize the database:
```bash
npm run init-db
```

### Step 3: Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### Step 4: Access the Application
Open your browser and navigate to: `http://localhost:3000`

## Configuration

### Database Configuration
Update the database connection settings in `server.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password', // Update this
  database: 'abhimo_appreciation_db'
});
```

### Company Branding
- Add your company logo to `public/images/abhimo-logo.png`
- Add founder signature to `public/images/founder-signature.png`
- Add company seal to `public/images/company-seal.png`

## Usage Guide

### 1. Generate Appreciation Letter
1. Navigate to the "Generate Letter" tab
2. Fill in employee details:
   - Employee Name
   - Department
   - Email Address
   - Subject line
   - Reason for appreciation
3. Click "Generate Letter"
4. Preview the generated letter
5. Edit if needed or download as PDF/Word

### 2. Manage Employees
1. Go to the "Employees" tab
2. Add new employees using the form
3. View all existing employees
4. Employee data is automatically linked to letters

### 3. View & Manage Letters
1. Access the "View Letters" tab
2. Browse all generated letters
3. Search letters by employee name, department, or subject
4. View, edit, or download existing letters

### 4. Edit Letters
1. Click "Edit" on any letter
2. Modify subject, reason, or letter content
3. Save changes to update the database
4. Download updated versions

### 5. Download Options
- **PDF Format**: Professional PDF with company letterhead
- **Word Format**: Editable DOCX file with proper formatting
- Both formats include company branding and signatures

## API Endpoints

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee

### Letter Management
- `POST /api/generate-letter` - Generate new letter
- `GET /api/letters` - Get all letters
- `GET /api/letters/:id` - Get specific letter
- `PUT /api/letters/:id` - Update letter

### Document Downloads
- `GET /api/download/pdf/:id` - Download letter as PDF
- `GET /api/download/word/:id` - Download letter as Word

## File Structure
```
abhimo-appreciation-app/
├── public/
│   ├── images/
│   │   └── placeholder.txt
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── scripts/
│   └── init-database.js
├── server.js
├── package.json
└── README.md
```

## Customization

### Letter Template
Modify the `generateLetterContent()` function in `server.js` to customize the letter template.

### Styling
Update `public/styles.css` to match your company's branding guidelines.

### Database Schema
Extend the database schema by modifying `scripts/init-database.js` for additional fields.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL server is running
   - Check database credentials in configuration
   - Ensure database exists (run `npm run init-db`)

2. **PDF Generation Issues**
   - Puppeteer requires additional dependencies on some systems
   - Install missing dependencies: `sudo apt-get install -y gconf-service libasound2-dev`

3. **Port Already in Use**
   - Change the PORT in `server.js` or kill the process using port 3000

### Performance Optimization
- Enable database indexing for large datasets
- Implement caching for frequently accessed data
- Use connection pooling for database connections

## Security Considerations
- Implement user authentication for production use
- Add input validation and sanitization
- Use environment variables for sensitive configuration
- Enable HTTPS in production

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For technical support or questions:
- Email: support@abhimo.com
- Documentation: Check this README file
- Issues: Create an issue in the project repository

## Version History
- **v1.0.0** - Initial release with core functionality
  - Letter generation and management
  - Employee management
  - PDF and Word export
  - Responsive web interface
  - MySQL database integration

---

**Abhimo Technologies** - Innovation in Employee Recognition