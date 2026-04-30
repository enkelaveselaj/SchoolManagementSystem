import bcrypt from "bcrypt";

import { findUserByEmail, createUser as createUserRow, findUsersByRoleName } from "../repositories/userRepository.js";
import { findRoleIdByName } from "../repositories/roleRepository.js";
import { assignRoleToUser, userHasRole } from "../repositories/userRoleRepository.js";
import { linkParentToStudent as linkParentToStudentRow, findStudentsByParentId, removeParentStudent, parentStudentExists, countParentsForStudent } from "../repositories/parentStudentRepository.js";

const ensureAdmin = (currentUser) => {
  if (!currentUser || currentUser.role !== "Admin") {
    throw new Error("Only admin can perform this action");
  }
};

export const createUser = async (data, currentUser) => {
  const { first_name, last_name, email, password, role } = data;

  ensureAdmin(currentUser);

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

export const linkParentToStudent = async (parentId, studentId, currentUser) => {

  ensureAdmin(currentUser);

  const isParent = await userHasRole({ userId: parentId, roleName: "Parent" });
  if (!isParent) {
    throw new Error("Invalid parent");
  }

  const isStudent = await userHasRole({ userId: studentId, roleName: "Student" });
  if (!isStudent) {
    throw new Error("Invalid student");
  }

  const alreadyLinked = await parentStudentExists({ parentId, studentId });

  if (alreadyLinked) {
    throw new Error("You have already assigned this student to the selected parent");
  }

  const parentCount = await countParentsForStudent({ studentId });
  if (parentCount >= 2) {
    throw new Error("This student already has the maximum of two parents assigned");
  }

  await linkParentToStudentRow({ parentId, studentId });

  return {
    message: "Parent linked to student successfully"
  };
};

export const getParentsWithStudents = async (currentUser) => {
  ensureAdmin(currentUser);

  const parents = await findUsersByRoleName("Parent");

  const parentsWithStudents = await Promise.all(
    parents.map(async (parent) => {
      const students = await findStudentsByParentId(parent.id);
      return {
        ...parent,
        students,
      };
    })
  );

  return parentsWithStudents;
};

export const assignParentToStudents = async ({ parentId, studentIds }, currentUser) => {
  ensureAdmin(currentUser);

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    // Interpret empty list as unassign all
    const existing = await findStudentsByParentId(parentId);
    await Promise.all(existing.map((student) => removeParentStudent({ parentId, studentId: student.id })));
    return {
      message: "Removed all student assignments for parent",
      added: 0,
      removed: existing.length,
    };
  }

  const uniqueStudentIds = [...new Set(studentIds.map((id) => Number(id)).filter(Boolean))];
  const existingStudents = await findStudentsByParentId(parentId);
  const existingIds = new Set(existingStudents.map((student) => Number(student.id)));
  const desiredIds = new Set(uniqueStudentIds);

  const toAdd = uniqueStudentIds.filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !desiredIds.has(id));

  if (toAdd.length === 0 && toRemove.length === 0) {
    throw new Error("This parent is already assigned to the selected students");
  }

  if (toAdd.length > 0) {
    const counts = await Promise.all(toAdd.map((studentId) => countParentsForStudent({ studentId })));
    const exceedingIndex = counts.findIndex((count) => count >= 2);
    if (exceedingIndex !== -1) {
      throw new Error("One of the selected students already has two parents assigned");
    }
  }

  await Promise.all(toAdd.map((studentId) => linkParentToStudent(parentId, studentId, currentUser)));
  await Promise.all(toRemove.map((studentId) => removeParentStudent({ parentId, studentId })));

  return {
    message: "Parent assignments updated successfully",
    added: toAdd.length,
    removed: toRemove.length,
  };
};