import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data) => {
  const { first_name, last_name, email, password } = data;

  const roleName = "Student";

  const [existing] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
    [first_name, last_name, email, password_hash]
  );

  const userId = result.insertId;

  const [roles] = await db.query(
    "SELECT id FROM roles WHERE name = ?",
    [roleName]
  );

  if (roles.length === 0) {
    throw new Error("Role not found");
  }

  const roleId = roles[0].id;

  await db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
    [userId, roleId]
  );

  return {
    id: userId,
    first_name,
    last_name,
    email,
    role: roleName,
  };
};


export const loginUser = async (data) => {
  const { email, password } = data;

  const [users] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const [roles] = await db.query(
    `SELECT r.name FROM roles r
     JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [user.id]
  );

  const role = roles[0]?.name;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role,
      is_super_admin: user.is_super_admin
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role,
      is_super_admin: user.is_super_admin
    }
  };
};