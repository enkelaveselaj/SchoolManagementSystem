-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;

-- Use the database
USE school_management;

-- Create academic_years table
CREATE TABLE IF NOT EXISTS academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_start_year (start_year),
    INDEX idx_is_current (is_current),
    CONSTRAINT chk_end_year_gt_start CHECK (end_year > start_year)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    grade_level INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    class_teacher_id INT NULL,
    capacity INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    INDEX idx_school_academic (school_id, academic_year_id),
    INDEX idx_grade_level (grade_level),
    INDEX idx_class_teacher (class_teacher_id),
    CONSTRAINT chk_grade_level CHECK (grade_level BETWEEN 1 AND 12),
    CONSTRAINT chk_capacity CHECK (capacity > 0),
    UNIQUE KEY uk_class_name (academic_year_id, grade_level, section, name)
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 30,
    room_number VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_class (class_id),
    INDEX idx_room (room_number),
    CONSTRAINT chk_section_capacity CHECK (capacity > 0),
    UNIQUE KEY uk_section_name (class_id, name)
);

-- Create students table (for future use)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    class_id INT NULL,
    section_id INT NULL,
    academic_year_id INT NULL,
    enrollment_date DATE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
    INDEX idx_student_name (last_name, first_name),
    INDEX idx_class_section (class_id, section_id),
    INDEX idx_academic_year (academic_year_id),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);

-- Create teachers table (for future use)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    qualification VARCHAR(100),
    experience_years INT DEFAULT 0,
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_teacher_name (last_name, first_name),
    INDEX idx_email (email),
    INDEX idx_specialization (specialization),
    INDEX idx_is_active (is_active),
    CONSTRAINT chk_experience CHECK (experience_years >= 0)
);

-- Insert sample academic years
INSERT INTO academic_years (name, start_year, end_year, is_current) VALUES 
('2023-2024', 2023, 2024, false),
('2024-2025', 2024, 2025, true)
ON DUPLICATE KEY UPDATE 
name = VALUES(name),
start_year = VALUES(start_year),
end_year = VALUES(end_year),
is_current = VALUES(is_current);

-- Insert sample classes for current academic year
INSERT INTO classes (school_id, academic_year_id, grade_level, section, name, capacity) VALUES 
(1, 2, 1, 'A', 'Grade 1 - Section A', 25),
(1, 2, 1, 'B', 'Grade 1 - Section B', 25),
(1, 2, 2, 'A', 'Grade 2 - Section A', 25),
(1, 2, 2, 'B', 'Grade 2 - Section B', 25),
(1, 2, 3, 'A', 'Grade 3 - Section A', 30),
(1, 2, 3, 'B', 'Grade 3 - Section B', 30),
(1, 2, 4, 'A', 'Grade 4 - Section A', 30),
(1, 2, 4, 'B', 'Grade 4 - Section B', 30),
(1, 2, 5, 'A', 'Grade 5 - Section A', 30),
(1, 2, 5, 'B', 'Grade 5 - Section B', 30)
ON DUPLICATE KEY UPDATE 
name = VALUES(name),
capacity = VALUES(capacity);

-- Insert sample sections
INSERT INTO sections (class_id, name, capacity, room_number) VALUES 
(1, 'Main', 25, 'Room 101'),
(2, 'Main', 25, 'Room 102'),
(3, 'Main', 25, 'Room 201'),
(4, 'Main', 25, 'Room 202'),
(5, 'Main', 30, 'Room 301'),
(6, 'Main', 30, 'Room 302'),
(7, 'Main', 30, 'Room 401'),
(8, 'Main', 30, 'Room 402'),
(9, 'Main', 30, 'Room 501'),
(10, 'Main', 30, 'Room 502')
ON DUPLICATE KEY UPDATE 
capacity = VALUES(capacity),
room_number = VALUES(room_number);

-- Insert sample teachers
INSERT INTO teachers (first_name, last_name, email, specialization, qualification, experience_years, hire_date) VALUES 
('John', 'Smith', 'john.smith@blueridge.edu', 'Mathematics', 'M.Ed Mathematics', 10, '2015-08-15'),
('Sarah', 'Johnson', 'sarah.johnson@blueridge.edu', 'English', 'M.A English Literature', 8, '2017-08-15'),
('Michael', 'Brown', 'michael.brown@blueridge.edu', 'Science', 'M.Sc Physics', 12, '2013-08-15'),
('Emily', 'Davis', 'emily.davis@blueridge.edu', 'Social Studies', 'M.A History', 6, '2019-08-15'),
('David', 'Wilson', 'david.wilson@blueridge.edu', 'Computer Science', 'B.Sc Computer Science', 5, '2020-08-15'),
('Lisa', 'Anderson', 'lisa.anderson@blueridge.edu', 'Art', 'B.F.A Fine Arts', 7, '2018-08-15'),
('Robert', 'Taylor', 'robert.taylor@blueridge.edu', 'Physical Education', 'B.Ed Physical Education', 9, '2016-08-15'),
('Jennifer', 'Thomas', 'jennifer.thomas@blueridge.edu', 'Music', 'B.Music Education', 4, '2021-08-15')
ON DUPLICATE KEY UPDATE 
specialization = VALUES(specialization),
qualification = VALUES(qualification),
experience_years = VALUES(experience_years);

-- Update some classes with class teachers
UPDATE classes SET class_teacher_id = 1 WHERE id IN (1, 2); -- John Smith for Grade 1
UPDATE classes SET class_teacher_id = 2 WHERE id IN (3, 4); -- Sarah Johnson for Grade 2
UPDATE classes SET class_teacher_id = 3 WHERE id IN (5, 6); -- Michael Brown for Grade 3
UPDATE classes SET class_teacher_id = 4 WHERE id IN (7, 8); -- Emily Davis for Grade 4
UPDATE classes SET class_teacher_id = 5 WHERE id IN (9, 10); -- David Wilson for Grade 5

-- Insert sample students
INSERT INTO students (first_name, last_name, email, date_of_birth, gender, class_id, section_id, academic_year_id) VALUES 
('Emma', 'Wilson', 'emma.wilson@student.blueridge.edu', '2018-03-15', 'Female', 1, 1, 2),
('Liam', 'Johnson', 'liam.johnson@student.blueridge.edu', '2018-07-22', 'Male', 1, 1, 2),
('Olivia', 'Brown', 'olivia.brown@student.blueridge.edu', '2018-11-10', 'Female', 2, 2, 2),
('Noah', 'Davis', 'noah.davis@student.blueridge.edu', '2018-02-28', 'Male', 2, 2, 2),
('Ava', 'Miller', 'ava.miller@student.blueridge.edu', '2017-05-18', 'Female', 3, 3, 2),
('Ethan', 'Garcia', 'ethan.garcia@student.blueridge.edu', '2017-09-05', 'Male', 3, 3, 2),
('Sophia', 'Martinez', 'sophia.martinez@student.blueridge.edu', '2017-12-12', 'Female', 4, 4, 2),
('Mason', 'Anderson', 'mason.anderson@student.blueridge.edu', '2017-04-20', 'Male', 4, 4, 2),
('Isabella', 'Taylor', 'isabella.taylor@student.blueridge.edu', '2016-08-15', 'Female', 5, 5, 2),
('James', 'Thomas', 'james.thomas@student.blueridge.edu', '2016-01-30', 'Male', 5, 5, 2),
('Mia', 'Jackson', 'mia.jackson@student.blueridge.edu', '2016-06-25', 'Female', 6, 6, 2),
('Benjamin', 'White', 'benjamin.white@student.blueridge.edu', '2016-10-10', 'Male', 6, 6, 2),
('Charlotte', 'Harris', 'charlotte.harris@student.blueridge.edu', '2015-03-08', 'Female', 7, 7, 2),
('William', 'Martin', 'william.martin@student.blueridge.edu', '2015-07-14', 'Male', 7, 7, 2),
('Amelia', 'Thompson', 'amelia.thompson@student.blueridge.edu', '2015-11-22', 'Female', 8, 8, 2),
('Lucas', 'Garcia', 'lucas.garcia@student.blueridge.edu', '2015-02-05', 'Male', 8, 8, 2),
('Harper', 'Martinez', 'harper.martinez@student.blueridge.edu', '2014-09-18', 'Female', 9, 9, 2),
('Henry', 'Robinson', 'henry.robinson@student.blueridge.edu', '2014-04-12', 'Male', 9, 9, 2),
('Evelyn', 'Clark', 'evelyn.clark@student.blueridge.edu', '2014-12-28', 'Female', 10, 10, 2),
('Alexander', 'Rodriguez', 'alexander.rodriguez@student.blueridge.edu', '2014-06-30', 'Male', 10, 10, 2)
ON DUPLICATE KEY UPDATE 
class_id = VALUES(class_id),
section_id = VALUES(section_id),
academic_year_id = VALUES(academic_year_id);
