# Auth Service Database Setup

This guide explains how to set up the database for the auth service, including creating the necessary tables and default admin user.

## Database Schema

The auth service requires the following tables:

### Tables

1. **roles** - User roles (Admin, Teacher, Student, Parent)
2. **users** - User accounts with authentication
3. **user_roles** - Junction table for user-role relationships
4. **parent_students** - Parent-student relationships

## Setup Instructions

### 1. Database Initialization

Run the initialization script to create all tables and insert default data:

```bash
# Navigate to auth-service directory
cd backend/services/auth-service

# Run the database initialization
mysql -u root -p < database/init.sql
```

Or if you're using a different MySQL user/host:

```bash
mysql -h localhost -u your_username -p school_management < database/init.sql
```

### 2. Environment Configuration

Make sure your `.env` file is configured correctly:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
DB_PORT=3306
```

### 3. Default Admin Account

The initialization script creates a default admin account:
- **Email**: njomzap@gmail.com
- **Password**: njomzap
- **Role**: Admin

## For Your Friends

When setting up the project on a new machine, your friends should:

1. **Clone the repository**
2. **Set up MySQL** and create the database
3. **Run the initialization script**:
   ```bash
   cd backend/services/auth-service
   mysql -u root -p < database/init.sql
   ```
4. **Configure environment variables** in `.env`
5. **Create additional admins** using the createAdmin script:
   ```bash
   npm run create-admin -- their.email@example.com theirpassword
   ```

## Security Notes

- The default admin password is hashed using bcrypt
- All passwords should be hashed before storing in the database
- The admin account created by the script is immediately active
- Consider changing the default admin password after initial setup

## Troubleshooting

### "Access denied for user" error
- Check your MySQL credentials in `.env`
- Ensure the MySQL user has the necessary permissions

### "Table doesn't exist" errors
- Run the initialization script again
- Check that you're using the correct database name

### "Admin role not found" error
- Ensure the `roles` table was created successfully
- Check that the default roles were inserted

## Database Schema Details

### roles table
- `id`: Primary key
- `name`: Role name (Admin, Teacher, Student, Parent)
- `description`: Role description
- `created_at`, `updated_at`: Timestamps

### users table
- `id`: Primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `firstName`, `lastName`: User name
- `roleId`: Foreign key to roles table
- `isActive`: Account status
- `createdAt`, `updatedAt`: Timestamps

### user_roles table
- `id`: Primary key
- `userId`: Foreign key to users table
- `roleId`: Foreign key to roles table
- `assigned_at`: When the role was assigned
- `assigned_by`: Who assigned the role (nullable)

### parent_students table
- `id`: Primary key
- `parentId`: Foreign key to users table (parent)
- `studentId`: Foreign key to users table (student)
- `relationship`: Relationship type
- `isPrimaryContact`: Whether this is the primary contact
- `createdAt`, `updatedAt`: Timestamps
