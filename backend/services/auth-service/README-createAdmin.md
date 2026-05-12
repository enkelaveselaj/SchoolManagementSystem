# Create Admin Script

This script allows you to create admin users for the School Management System.

## Prerequisites

- Node.js installed
- MySQL database running
- Database configured in `.env` file

## Usage

### Method 1: Using npm script (recommended)
```bash
npm run create-admin -- <email> <password> [firstName] [lastName]
```

### Method 2: Direct node execution
```bash
node createAdmin.js <email> <password> [firstName] [lastName]
```

## Examples

```bash
# Create admin with just email and password
npm run create-admin -- admin@example.com mypassword

# Create admin with full name
npm run create-admin -- john.doe@school.com secretp123 John Doe
```

## What it does

1. Checks if the email already exists
2. Finds the Admin role in the database
3. Hashes the password using bcrypt
4. Creates the user with Admin role
5. Activates the account immediately

## Environment Variables

Make sure your `.env` file has the correct database configuration:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_management
DB_PORT=3306
```

## Notes

- The script will exit if the email already exists
- The Admin role must exist in the `roles` table
- Passwords are securely hashed with bcrypt (10 salt rounds)
- Created users are immediately active
