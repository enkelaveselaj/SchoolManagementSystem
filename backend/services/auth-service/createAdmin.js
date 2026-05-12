import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306,
};

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node createAdmin.js <email> <password> [firstName] [lastName]');
    console.log('Example: node createAdmin.js admin@example.com mypassword John Doe');
    process.exit(1);
  }

  const [email, password, firstName = 'Admin', lastName = 'User'] = args;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log(`User with email ${email} already exists`);
      process.exit(1);
    }

    // Get admin role ID
    const [roles] = await connection.execute(
      'SELECT id FROM roles WHERE name = ?',
      ['Admin']
    );

    if (roles.length === 0) {
      console.log('Admin role not found in database. Please ensure roles are seeded.');
      process.exit(1);
    }

    const adminRoleId = roles[0].id;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, firstName, lastName, roleId, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, firstName, lastName, adminRoleId, 1]
    );

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   User ID: ${result.insertId}`);
    console.log(`   Role: Admin`);
    console.log('\nYou can now log in with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
