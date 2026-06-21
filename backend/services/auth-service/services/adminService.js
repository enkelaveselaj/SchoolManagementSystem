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

  // Sync with domain services
  try {
    if (role === "Student") {
      const studentResponse = await fetch(`http://localhost:5004/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: first_name,
          lastName: last_name,
          email,
          userId
        }),
      });
      if (!studentResponse.ok) console.error('Failed to sync student to student-service');
    }
  } catch (err) {
    console.error('Service sync error:', err.message);
  }

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

export const createTeacher = async (data, currentUser) => {
  const { firstName, lastName, email, password, phone, specialization, qualification, experience, hireDate, employeeId, emergencyContact, emergencyPhone } = data;

  ensureAdmin(currentUser);

  const existing = await findUserByEmail(email);

  if (existing.length > 0) {
    throw new Error("User with this email already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const userId = await createUserRow({
    first_name: firstName,
    last_name: lastName,
    email,
    password_hash,
  });

  const roleId = await findRoleIdByName("Teacher");

  if (!roleId) {
    throw new Error("Teacher role not found");
  }

  await assignRoleToUser({ userId, roleId });

  // Create teacher record in teacher-student service
  try {
    const teacherResponse = await fetch(`http://localhost:5004/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        specialization,
        qualification,
        experience: experience ? parseInt(experience) : null,
        hireDate,
        employeeId,
        emergencyContact,
        emergencyPhone,
        userId // Link to auth user
      }),
    });

    if (!teacherResponse.ok) {
      throw new Error('Failed to create teacher record in teacher service');
    }

    const teacherRecord = await teacherResponse.json();

    return {
      id: userId,
      userId,
      teacherId: teacherRecord.id,
      firstName,
      lastName,
      email,
      role: "Teacher",
      specialization,
      qualification,
      employeeId,
    };
  } catch (error) {
    // If teacher service fails, we should clean up the auth user
    // For now, just throw the error
    throw new Error(`Failed to create teacher: ${error.message}`);
  }
};

export const getParentChildren = async (currentUser) => {
  if (!currentUser || currentUser.role !== "Parent") {
    throw new Error("Only parents can access their children's information");
  }

  const children = await findStudentsByParentId(currentUser.id);
  return children;
};

export const getAllUsersByRole = async (role) => {
    const users = await findUsersByRoleName(role);
    return users.map(u => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email
    }));
};