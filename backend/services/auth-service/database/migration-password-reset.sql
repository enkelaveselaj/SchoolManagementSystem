-- Migration: Add password reset and email verification columns
-- Run this after initial database setup

USE auth_db;

-- Add password reset columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token_expires DATETIME DEFAULT NULL;

-- Add email verification columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token_expires DATETIME DEFAULT NULL;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON users(email_verification_token);

-- Verify columns were added
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'auth_db'
ORDER BY ORDINAL_POSITION;

