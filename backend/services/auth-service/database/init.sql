-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;

-- Use the database
USE school_management;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role_name (name)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    roleId INT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (roleId),
    INDEX idx_is_active (isActive)
);

-- Create user_roles junction table (for future flexibility)
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    roleId INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT NULL,
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_role (userId, roleId),
    INDEX idx_user (userId),
    INDEX idx_role (roleId)
);

-- Create parent_students table for parent-student relationships
CREATE TABLE IF NOT EXISTS parent_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parentId INT NOT NULL,
    studentId INT NOT NULL,
    relationship VARCHAR(50) DEFAULT 'Parent',
    isPrimaryContact BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_parent_student (parentId, studentId),
    INDEX idx_parent (parentId),
    INDEX idx_student (studentId),
    INDEX idx_primary_contact (isPrimaryContact)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('Admin', 'Full system administrator with access to all features'),
('Teacher', 'Teacher with access to class management and student data'),
('Student', 'Student with access to personal academic information'),
('Parent', 'Parent with access to their children''s academic information')
ON DUPLICATE KEY UPDATE 
name = VALUES(name),
description = VALUES(description);

-- Create default admin user (njomzap@gmail.com)
-- Password: njomzap (hashed with bcrypt)
INSERT INTO users (email, password, firstName, lastName, roleId, isActive) VALUES 
('njomzap@gmail.com', '$2b$10$3rL9QDovEmRczhoj3N4CQ.rsSaeInQe9mkvXyqH5LAnE5wWtlM9P.', 'Admin', 'User', 1, TRUE)
ON DUPLICATE KEY UPDATE 
firstName = VALUES(firstName),
lastName = VALUES(lastName),
roleId = VALUES(roleId),
isActive = VALUES(isActive);

-- Note: Replace $2b$10$YourHashedPasswordHere with the actual bcrypt hash of 'njomzap'
-- You can generate this using Node.js: bcrypt.hash('njomzap', 10)
