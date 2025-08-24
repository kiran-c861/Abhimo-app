-- Abhimo Technologies - Appreciation Letter Generator Database Schema
-- MySQL/MariaDB Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS abhimo_letters;
USE abhimo_letters;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_department (department)
);

-- Create company_details table
CREATE TABLE IF NOT EXISTS company_details (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    logo_url VARCHAR(255),
    founder_name VARCHAR(255) NOT NULL,
    founder_signature_url VARCHAR(255),
    seal_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appreciation_letters table
CREATE TABLE IF NOT EXISTS appreciation_letters (
    letter_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    subject VARCHAR(500) NOT NULL,
    reason TEXT NOT NULL,
    generated_letter TEXT NOT NULL,
    format_selected VARCHAR(50) DEFAULT 'both',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_created_at (created_at),
    INDEX idx_employee_date (employee_id, created_at)
);

-- Insert default company details
INSERT IGNORE INTO company_details 
(name, address, founder_name, logo_url, founder_signature_url, seal_url) 
VALUES (
    'Abhimo Technologies Pvt Ltd',
    'F07, D.No. 2-11/26(27), "Green City", Behind Naganakatte, N.H.66, Thokottu, Mangaluru - 575017, Karnataka, India',
    'Naveen Nayak',
    '/images/abhimo-logo.svg',
    '/images/founder-signature.png',
    '/images/company-seal.png'
);

-- Insert sample employees
INSERT IGNORE INTO employees (name, department, email) VALUES
('John Doe', 'Software Development', 'john.doe@abhimo.com'),
('Jane Smith', 'Quality Assurance', 'jane.smith@abhimo.com'),
('Mike Johnson', 'DevOps', 'mike.johnson@abhimo.com'),
('Sarah Wilson', 'UI/UX Design', 'sarah.wilson@abhimo.com'),
('David Brown', 'Project Management', 'david.brown@abhimo.com');