# School Service Setup

## Database Setup

The school service requires a MySQL database to be set up. Follow these steps:

### 1. Create Database
Run the SQL script in `database/setup.sql` to create the database and tables:

```sql
mysql -u root -p < database/setup.sql
```

### 2. Environment Configuration
Create a `.env` file in the school-service directory with the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
PORT=5002
```

### 3. Install Dependencies
```bash
cd backend/services/school-service
npm install
```

### 4. Start the Service
```bash
npm start
```

## API Endpoints

- `GET /school` - Get school information
- `PUT /school` - Update school information
- `GET /health` - Health check

## Sample Data

The setup script includes sample data for Blue Ridge Academy with:
- Name: Blue Ridge Academy
- Address: 1234 Academy Drive, Mountain View, CA 94043
- Founded: 1985
- Students: 1200
- Teachers: 85
- Programs: 25
