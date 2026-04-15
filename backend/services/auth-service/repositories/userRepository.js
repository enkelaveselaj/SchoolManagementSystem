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
