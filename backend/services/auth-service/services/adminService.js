import db from "../db.js";
import bcrypt from "bcrypt";

export const createUser = async (data, currentUser) => {
  const { first_name, last_name, email, password, role } = data;

  if (currentUser.role !== "Admin") {
    throw new Error("Only admin can create users");
  }

  if (role === "Admin") {
    if (!currentUser.is_super_admin) {
      throw new Error("Only super admin can create admins");
    }
  }

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
    [role]
  );

  if (roles.length === 0) {
    throw new Error("Invalid role");
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
    role,
  };
};

export const linkParentToStudent = async (parentId, studentId) => {
 
  const [parent] = await db.query(
    `SELECT u.id FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE u.id = ? AND r.name = 'Parent'`,
    [parentId]
  );

  if (parent.length === 0) {
    throw new Error("Invalid parent");
  }

  const [student] = await db.query(
    `SELECT u.id FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE u.id = ? AND r.name = 'Student'`,
    [studentId]
  );

  if (student.length === 0) {
    throw new Error("Invalid student");
  }

  await db.query(
    "INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)",
    [parentId, studentId]
  );

  return {
    message: "Parent linked to student successfully"
  };
};