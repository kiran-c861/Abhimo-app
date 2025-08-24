# Abhimo Technologies - Appreciation Letter Generator Demo

## Quick Start Guide

### Prerequisites
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Start your MySQL server
   - Create a `.env` file by copying `.env.example`.
   - Update the database credentials in the `.env` file.
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=abhimo_letters
   DB_PORT=3306
   ```

3. **Start the Application**
   The application will automatically create the database tables on the first run.
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your browser and go to: `http://localhost:3001`

### Features

#### 1. Generate Appreciation Letter
- Navigate to "Generate Letter" tab
- Fill in employee details:
  - **Employee Name**: John Doe
  - **Department**: Software Development
  - **Email**: john.doe@abhimo.com
  - **Subject**: Outstanding Performance in Q4 2024
  - **Reason**: Exceptional work on the new client portal project, delivering ahead of schedule and exceeding quality expectations.
- Click "Generate Letter"
- Preview the generated letter
- Download as PDF or Word document

#### 2. Employee Management
- Go to "Employees" tab
- Add new employees using the form
- View all existing employees
- Sample employees are pre-loaded for testing

#### 3. Letter Management
- Access "View Letters" tab
- Browse all generated letters
- Search by employee name, department, or subject
- Edit existing letters
- Download letters in multiple formats

### Sample Data
The application comes with pre-loaded sample employees:
- John Doe (Software Development)
- Jane Smith (Quality Assurance)
- Mike Johnson (DevOps)
- Sarah Wilson (UI/UX Design)
- David Brown (Project Management)

### Key Features Demonstrated

1. **Professional Letter Generation**
   - Company letterhead with Abhimo Technologies branding
   - Formal business letter format
   - Personalized content based on input
   - Date and signature inclusion

2. **Multi-format Export**
   - High-quality PDF generation with proper formatting
   - Editable Word documents (.docx)
   - Professional layout with company branding

3. **Database Integration**
   - Employee records management
   - Letter history tracking
   - Relationship between employees and letters

4. **Responsive Web Interface**
   - Clean, modern design
   - Mobile-friendly layout
   - Intuitive navigation with tabs
   - Real-time form validation

5. **Search and Filter**
   - Quick search through letters
   - Filter by various criteria
   - Easy access to historical data

### Troubleshooting

**Database Connection Issues:**
- Ensure MySQL server is running
- Verify database credentials
- Check if port 3306 is available

**PDF Generation Issues:**
- Puppeteer may require additional system dependencies
- On some systems, you may need to install additional libraries for Chromium to run.

**Port Already in Use:**
- Change PORT in server.js or stop other services using port 3000

### Customization Options

1. **Company Branding**
   - Replace logo in `public/images/abhimo-logo.png`
   - Update company details in `database_schema.sql` before the first run.
   - Modify letter template in `generateLetterContent()` function

2. **Styling**
   - Customize CSS in `public/styles.css`
   - Modify color scheme and fonts
   - Adjust responsive breakpoints

3. **Letter Template**
   - Edit the `letterHtml` string in `server.js` to change the letter's structure.
   - Add custom fields or formatting
   - Include additional company information

### Production Deployment

For production use, consider:
- Environment variables for database credentials
- HTTPS configuration
- User authentication and authorization
- Input validation and sanitization
- Error logging and monitoring
- Database connection pooling
- Caching for better performance

### Support

For technical support or questions:
- Check the README.md file for detailed documentation
- Review the code comments for implementation details
- Test with the provided sample data first

---

**Abhimo Technologies** - Streamlining Employee Recognition Through Technology