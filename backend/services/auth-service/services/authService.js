import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  createUser as createUserRow,
} from "../repositories/userRepository.js";
import { findRoleIdByName, findRoleNamesByUserId } from "../repositories/roleRepository.js";
import { assignRoleToUser } from "../repositories/userRoleRepository.js";
import { countStudentsForParent } from "../repositories/parentStudentRepository.js";

export const registerUser = async (data) => {
  const { first_name, last_name, email, password } = data;

  const roleName = "Student";

  const existing = await findUserByEmail(email);

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const userId = await createUserRow({
    first_name,
    last_name,
    email,
    password_hash,
  });

  const roleId = await findRoleIdByName(roleName);

  if (!roleId) {
    throw new Error("Role not found");
  }

  await assignRoleToUser({ userId, roleId });

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

  const users = await findUserByEmail(email);

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const roleNames = await findRoleNamesByUserId(user.id);
  const role = roleNames[0];

  // Check if parent is assigned to any students
  if (role === "Parent") {
    const studentCount = await countStudentsForParent({ parentId: user.id });
    if (studentCount === 0) {
      throw new Error("You are not assigned to any students yet. Please contact the administrator to be assigned to your children.");
    }
  }

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
      firstName: user.first_name,
      lastName: user.last_name,
      role,
      is_super_admin: user.is_super_admin
    }
  };
};