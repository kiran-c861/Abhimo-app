# Abhimo Technologies - Appreciation Letter Generator
## Complete Developer Setup Instructions

### 📋 **Project Overview**
A full-stack web application for generating professional appreciation letters with PDF/Word export functionality, employee management, and database storage.

---

## 🛠️ **Prerequisites & System Requirements**

### **1. Required Software Downloads**
Before starting, download and install the following:

#### **Node.js & npm**
- **Download**: [Node.js Official Website](https://nodejs.org/)
- **Version**: Node.js 16.x or higher (includes npm)
- **Verify Installation**:
  ```bash
  node --version
  npm --version
  ```

#### **Git (Optional but Recommended)**
- **Download**: [Git Official Website](https://git-scm.com/)
- **Purpose**: Version control and cloning repositories

#### **MySQL/MariaDB Database**
- **Download MySQL**: [MySQL Official Website](https://dev.mysql.com/downloads/)
- **Alternative**: [XAMPP](https://www.apachefriends.org/) (includes MySQL)
- **Alternative**: [MariaDB](https://mariadb.org/download/)
- **Version**: MySQL 8.0+ or MariaDB 10.4+

#### **Code Editor**
- **Recommended**: [Visual Studio Code](https://code.visualstudio.com/)
- **Alternative**: Any text editor (Sublime Text, Atom, etc.)

---

## 🔧 **IDE Extensions (Visual Studio Code)**

### **Essential Extensions**
Install these extensions in VS Code for optimal development experience:

1. **Node.js Extension Pack**
   - Extension ID: `ms-vscode.vscode-node-extension-pack`
   - Includes: npm, Node.js debugging, and IntelliSense

2. **JavaScript (ES6) Code Snippets**
   - Extension ID: `xabikos.JavaScriptSnippets`
   - Purpose: Code snippets and autocompletion

3. **HTML CSS Support**
   - Extension ID: `ecmel.vscode-html-css`
   - Purpose: CSS class name completion in HTML

4. **Live Server**
   - Extension ID: `ritwickdey.LiveServer`
   - Purpose: Local development server with live reload

5. **Prettier - Code Formatter**
   - Extension ID: `esbenp.prettier-vscode`
   - Purpose: Automatic code formatting

6. **ESLint**
   - Extension ID: `dbaeumer.vscode-eslint`
   - Purpose: JavaScript linting and error detection

### **Optional but Helpful Extensions**
- **Auto Rename Tag**: `formulahendry.auto-rename-tag`
- **Bracket Pair Colorizer**: `CoenraadS.bracket-pair-colorizer`
- **Path Intellisense**: `christian-kohler.path-intellisense`
- **REST Client**: `humao.rest-client` (for API testing)

---

## 📁 **Project Setup Instructions**

### **Step 1: Project Directory Setup**
```bash
# Navigate to your desired directory
cd C:\Users\YourName\Desktop

# Create project directory (if not already exists)
mkdir Abhimo_app
cd Abhimo_app
```

### **Step 2: Initialize Node.js Project**
```bash
# Initialize package.json
npm init -y
```

### **Step 3: Install Dependencies**
```bash
# Install all dependencies
npm install

# Or, to install manually:
# npm install express mysql2 cors body-parser puppeteer docx dotenv
# npm install --save-dev nodemon
```

### **Step 4: Verify Project Structure**
Your project should have this structure:
```
Abhimo_app/
├── node_modules/          # Auto-generated
├── public/
│   ├── images/
│   │   ├── abhimo-logo-rectangle.svg
│   │   ├── founder-signature.svg
│   │   └── company-seal.svg
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .env
├── .env.example
├── database_schema.sql
├── package.json
├── package-lock.json
├── server.js
└── SETUP_INSTRUCTIONS.md
```

---

## 🚀 **Running the Application**

### **Method 1: Standard Node.js**
```bash
# Navigate to project directory
cd C:\Users\YourName\Desktop\Abhimo_app

# Start the server
node server.js
```

### **Method 2: Using npm Scripts**
Add this to your `package.json` scripts section:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Then run:
```bash
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
```

### **Method 3: VS Code Integrated Terminal**
1. Open VS Code
2. Open the project folder (`File > Open Folder`)
3. Open integrated terminal (`Terminal > New Terminal`)
4. Run: `npm start`

---

## 🌐 **Accessing the Application**

### **Default URLs**
- **Main Application**: http://localhost:3001
- **Server Port**: 3001 (configurable in server.js)

### **Application Features**
- **Generate Letters**: Create appreciation letters
- **View Letters**: Browse and search existing letters
- **Employee Management**: Add and manage employees
- **Export Options**: Download as PDF or Word documents

---

## 🗄️ **Database Setup (MySQL)**

### **Step 1: Install MySQL**
Choose one of these options:

#### **Option A: MySQL Server**
1. Download from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)
2. Install MySQL Server
3. Remember the root password you set during installation

#### **Option B: XAMPP (Recommended for beginners)**
1. Download [XAMPP](https://www.apachefriends.org/)
2. Install XAMPP
3. Start MySQL service from XAMPP Control Panel

### **Step 2: Create Database**
```sql
-- Option 1: Use MySQL Command Line
mysql -u root -p
CREATE DATABASE abhimo_letters;
exit;

-- Option 2: Use phpMyAdmin (if using XAMPP)
-- Go to http://localhost/phpmyadmin
-- Create new database named 'abhimo_letters'
```

### **Step 3: Configure Environment Variables**
Create a `.env` file in your project root:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=abhimo_letters
DB_PORT=3306
```

### **Step 4: Database Schema**
The application will automatically create tables on first run, or you can run the SQL file:
```bash
# Import database schema (optional)
mysql -u root -p abhimo_letters < database_schema.sql
```

### **Database Information**
- **Type**: MySQL/MariaDB
- **Database**: `abhimo_letters`
- **Tables**: employees, company_details, appreciation_letters
- **Auto-Creation**: Tables created automatically on first run

### **Sample Data**
The application automatically creates:
- Sample employees
- Company information for Abhimo Technologies
- Database schema with indexes

---

## 🔧 **Configuration Options**

### **Port Configuration**
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to desired port
```

### **Company Information**
Update company details in the `initializeDatabase()` function in `server.js`

---

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Change port in server.js or kill the process using the port

#### **2. Module Not Found**
```bash
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` to install dependencies

#### **3. Permission Errors**
**Solution**: Run terminal as administrator (Windows) or use `sudo` (Mac/Linux)

#### **4. Puppeteer Installation Issues**
```bash
# If Puppeteer fails to install
npm install puppeteer --unsafe-perm=true --allow-root
```

#### **5. Database Locked Error**
**Solution**: Close any SQLite viewers and restart the application

---

## 📦 **Dependencies Explanation**

### **Production Dependencies**
- **express**: Web framework for Node.js
- **sqlite3**: SQLite database driver
- **cors**: Cross-Origin Resource Sharing middleware
- **body-parser**: Parse incoming request bodies
- **puppeteer**: Headless Chrome for PDF generation
- **docx**: Microsoft Word document generation

### **Development Dependencies**
- **nodemon**: Auto-restart server on file changes

---

## 🔄 **Development Workflow**

### **1. Start Development**
```bash
npm run dev  # Auto-restart on changes
```

### **2. Make Changes**
- Edit files in VS Code
- Server automatically restarts (if using nodemon)
- Refresh browser to see changes

### **3. Test Features**
- Generate letters
- Test PDF/Word downloads
- Verify database operations

---

## 📝 **Project Features**

### **Frontend**
- Responsive HTML/CSS/JavaScript
- Professional UI with company branding
- Form validation and user feedback
- Modal dialogs for viewing letters

### **Backend**
- Express.js REST API
- SQLite database integration
- PDF generation with Puppeteer
- Word document creation with docx

### **Database**
- Employee management
- Letter storage and retrieval
- Company information management

---

## 🚀 **Deployment Notes**

### **For Production Deployment**
1. Set environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Database backup strategy

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3001
```

---

## 📞 **Support & Contact**

### **For Technical Issues**
- Check console logs for errors
- Verify all dependencies are installed
- Ensure correct Node.js version
- Review this setup guide

### **Project Information**
- **Company**: Abhimo Technologies Pvt Ltd
- **Location**: Mangaluru, Karnataka, India
- **Application**: Employee Appreciation Letter Generator

---

## ✅ **Quick Start Checklist**

- [ ] Node.js installed (v16+)
- [ ] VS Code installed with recommended extensions
- [ ] Project files in correct directory structure
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm start`)
- [ ] Application accessible at http://localhost:3001
- [ ] Can generate and download letters
- [ ] Database operations working

---

**🎉 Congratulations! Your Abhimo Technologies Appreciation Letter Generator is now ready for development and use!**