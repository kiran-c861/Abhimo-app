@echo off
echo ========================================
echo Abhimo Technologies - Appreciation Letter Generator
echo Setup Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
echo.

echo Step 2: Setting up database...
echo Please make sure MySQL is running and update the database credentials in:
echo - server.js (line 12-17)
echo - scripts/init-database.js (line 4-7)
echo.
echo Press any key to continue with database initialization...
pause > nul

echo Initializing database...
call npm run init-db
echo.

echo Step 3: Starting the application...
echo The application will start on http://localhost:3000
echo.
call npm start

pause