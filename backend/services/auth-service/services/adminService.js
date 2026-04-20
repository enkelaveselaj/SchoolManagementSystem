import bcrypt from "bcrypt";

import { findUserByEmail, createUser as createUserRow } from "../repositories/userRepository.js";
import { findRoleIdByName } from "../repositories/roleRepository.js";
import { assignRoleToUser, userHasRole } from "../repositories/userRoleRepository.js";
import { linkParentToStudent as linkParentToStudentRow } from "../repositories/parentStudentRepository.js";

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

  const roleId = await findRoleIdByName(role);

  if (!roleId) {
    throw new Error("Invalid role");
  }

  await assignRoleToUser({ userId, roleId });

  return {
    id: userId,
    first_name,
    last_name,
    email,
    role,
  };
};

export const linkParentToStudent = async (parentId, studentId) => {

  const isParent = await userHasRole({ userId: parentId, roleName: "Parent" });
  if (!isParent) {
    throw new Error("Invalid parent");
  }

  const isStudent = await userHasRole({ userId: studentId, roleName: "Student" });
  if (!isStudent) {
    throw new Error("Invalid student");
  }

  await linkParentToStudentRow({ parentId, studentId });

  return {
    message: "Parent linked to student successfully"
  };
};