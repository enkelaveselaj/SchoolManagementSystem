-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS auth_db;

-- Use the database
USE auth_db;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (matching actual schema)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_super_admin TINYINT(1) DEFAULT 0,
    
    INDEX idx_email (email)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    role_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
);

-- Create parent_students table
CREATE TABLE IF NOT EXISTS parent_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    student_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_parent_id (parent_id),
    INDEX idx_student_id (student_id)
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
INSERT INTO users (first_name, last_name, email, password_hash) VALUES 
('Admin', 'User', 'njomzap@gmail.com', '$2b$10$3rL9QDovEmRczhoj3N4CQ.rsSaeInQe9mkvXyqH5LAnE5wWtlM9P.')
ON DUPLICATE KEY UPDATE 
first_name = VALUES(first_name),
last_name = VALUES(last_name);

-- Assign admin role to default admin user
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u 
CROSS JOIN roles r 
WHERE u.email = 'njomzap@gmail.com' AND r.name = 'Admin'
ON DUPLICATE KEY UPDATE 
user_id = VALUES(user_id),
role_id = VALUES(role_id);
