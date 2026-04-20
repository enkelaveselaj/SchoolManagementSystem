import db from "../db.js";

export const assignRoleToUser = async ({ userId, roleId }) => {
  await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
    userId,
    roleId,
  ]);
};

export const userHasRole = async ({ userId, roleName }) => {
  const [rows] = await db.query(
    `SELECT 1 AS ok FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = ?
     LIMIT 1`,
    [userId, roleName]
  );

  return rows.length > 0;
};
