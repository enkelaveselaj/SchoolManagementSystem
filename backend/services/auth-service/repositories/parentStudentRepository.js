import db from "../db.js";

export const linkParentToStudent = async ({ parentId, studentId }) => {
  await db.query(
    "INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)",
    [parentId, studentId]
  );
};
