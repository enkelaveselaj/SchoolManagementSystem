import db from "../db.js";

export const linkParentToStudent = async ({ parentId, studentId }) => {
  await db.query(
    "INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)",
    [parentId, studentId]
  );
};

export const findStudentsByParentId = async (parentId) => {
  const [rows] = await db.query(
    `SELECT DISTINCT s.id, s.first_name, s.last_name, s.email
     FROM parent_students ps
     JOIN users s ON ps.student_id = s.id
     WHERE ps.parent_id = ?
     ORDER BY s.first_name ASC`,
    [parentId]
  );

  return rows;
};

export const parentStudentExists = async ({ parentId, studentId }) => {
  const [rows] = await db.query(
    `SELECT 1 FROM parent_students WHERE parent_id = ? AND student_id = ? LIMIT 1`,
    [parentId, studentId]
  );

  return rows.length > 0;
};

export const removeParentStudent = async ({ parentId, studentId }) => {
  await db.query(
    `DELETE FROM parent_students WHERE parent_id = ? AND student_id = ?`,
    [parentId, studentId]
  );
};

export const countParentsForStudent = async ({ studentId }) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM parent_students WHERE student_id = ?`,
    [studentId]
  );

  return rows[0]?.total ?? 0;
};
