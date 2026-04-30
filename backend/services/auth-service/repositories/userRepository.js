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
