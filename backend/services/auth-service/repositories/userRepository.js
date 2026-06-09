import db from "../db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows;
};

export const createUser = async ({ first_name, last_name, email, password_hash }) => {
  const [result] = await db.query(
    "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
    [first_name, last_name, email, password_hash]
  );

  return result.insertId;
};

export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
};

export const findUserByResetToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE password_reset_token = ? AND password_reset_token_expires > NOW()",
    [token]
  );
  return rows[0] || null;
};

export const findUserByVerificationToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email_verification_token = ? AND email_verification_token_expires > NOW()",
    [token]
  );
  return rows[0] || null;
};

export const updateUser = async (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return null;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const [result] = await db.query(
    `UPDATE users SET ${setClause} WHERE id = ?`,
    [...values, id]
  );

  return result.affectedRows > 0;
};

export const findUsersByRoleName = async (roleName) => {
  const [rows] = await db.query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.created_at
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE r.name = ?
     ORDER BY u.created_at DESC`,
    [roleName]
  );

  return rows;
};
