import db from "../connectionMYSQL.js";


export const insertUser = async ({ first_name, last_name, email, password, phone, role }) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(query, [first_name, last_name, email, password, phone, role]);
  return result.insertId;
};

export const getUserWithPasswordByEmail = async (email) => {
  const query = `
    SELECT user_id, first_name, last_name, email, password, phone, role, created_at
    FROM users
    WHERE email = ?
  `;
  const [rows] = await db.execute(query, [email]);
  return rows[0] || null;
}

export const getUserById = async (user_id) => {
  const query = `
    SELECT user_id, first_name, last_name, email, role , phone
    FROM users
    WHERE user_id = ?
  `;
  const [rows] = await db.execute(query, [user_id]);
  return rows[0] || null;
};

export const checkEmailExists = async (email) => {
  try {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0].count > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
  }
};

export const fetchUsers = async (page = 1, limit = 20, role = null) => {
  try {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    let query = `
      SELECT user_id, first_name, last_name, email, phone, role, created_at
      FROM users
    `;
    let countQuery = `SELECT COUNT(*) AS total FROM users`;
    const values = [];
    const countValues = [];

    if (role && ['ADMIN', 'VENDOR', 'USER'].includes(role)) {
      query += ` WHERE role = ?`;
      countQuery += ` WHERE role = ?`;
      values.push(role);
      countValues.push(role);
    }

    query += ` ORDER BY created_at DESC LIMIT ${parsedLimit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, values);
    const [[{ total }]] = await db.execute(countQuery, countValues);

    return {
      users: rows,
      total,
      totalPages: Math.ceil(total / parsedLimit),
      currentPage: parsedPage,
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const updateUserInDb = async (params) => {
  const { userId, first_name, last_name, phone, email } = params;

  if (!userId) throw new Error("User ID is required");

  // Fetch last_updated_on timestamp first
  const [userRows] = await db.execute(
    `SELECT last_updated_on FROM users WHERE user_id = ?`,
    [userId]
  );

  if (userRows.length === 0) {
    throw new Error("User not found");
  }

  const lastUpdatedOn = userRows[0].last_updated_on;
  if (lastUpdatedOn) {
    const now = new Date();
    const lastUpdatedDate = new Date(lastUpdatedOn);
    const diffMs = now - lastUpdatedDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 10) {
      const waitDays = 10 - diffDays;
      throw new Error(
        `Cannot update profile twice within 10 days. Please wait ${waitDays} more day(s).`
      );
    }
  }

  // Prepare dynamic query parts
  const fields = [];
  const values = [];

  if (first_name !== undefined) {
    fields.push("first_name = ?");
    values.push(first_name.trim());
  }
  if (last_name !== undefined) {
    fields.push("last_name = ?");
    values.push(last_name.trim());
  }
  if (phone !== undefined) {
    fields.push("phone = ?");
    values.push(phone.trim());
  }
  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email.trim());
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  // No need to manually update last_updated_on, MySQL does it automatically on update

  // Build query dynamically
  const sqlUpdate = `
    UPDATE users 
    SET ${fields.join(", ")}
    WHERE user_id = ?
  `;
  values.push(userId);

  // Execute update
  const [result] = await db.execute(sqlUpdate, values);

  if (result.affectedRows === 0) {
    throw new Error("User not found");
  }

  // Return updated user info
  const [rows] = await db.execute(
    `SELECT user_id, first_name, last_name, phone, email, role FROM users WHERE user_id = ?`,
    [userId]
  );

  return rows[0];
};





