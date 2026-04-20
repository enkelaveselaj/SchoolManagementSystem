import db from "../db.js";

export const findRoleIdByName = async (name) => {
  const [rows] = await db.query("SELECT id FROM roles WHERE name = ?", [name]);
  return rows[0]?.id ?? null;
};

export const findRoleNamesByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT r.name FROM roles r
     JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );

  return rows.map((r) => r.name);
};
