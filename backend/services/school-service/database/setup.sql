-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;

-- Use the database
USE school_management;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    founded YEAR DEFAULT 1985,
    students INT DEFAULT 1200,
    teachers INT DEFAULT 85,
    programs INT DEFAULT 25,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample school data
INSERT INTO schools (name, address, founded, students, teachers, programs) VALUES 
('Blue Ridge Academy', '1234 Academy Drive, Mountain View, CA 94043', 1985, 1200, 85, 25)
ON DUPLICATE KEY UPDATE 
name = VALUES(name),
address = VALUES(address),
founded = VALUES(founded),
students = VALUES(students),
teachers = VALUES(teachers),
programs = VALUES(programs);
