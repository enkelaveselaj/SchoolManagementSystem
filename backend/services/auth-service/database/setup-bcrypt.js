import bcrypt from 'bcrypt';

// Generate bcrypt hash for the default admin password
async function generateHash() {
  const password = 'njomzap';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated bcrypt hash for "njomzap":');
    console.log(hash);
    console.log('\nReplace $2b$10$YourHashedPasswordHere in init.sql with this hash.');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
