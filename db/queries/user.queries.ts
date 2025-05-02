import db from "db/my-db.js";

const createUser = db.prepare(`
    INSERT INTO users (user_id, username, password, created_at)
    VALUES (?, ?, ?, ?)
    RETURNING user_id, username, created_at
`);
  
const getUserByUsername = db.prepare(`
    SELECT * FROM users WHERE username = ?
`);
  
const getUserById = db.prepare(`
    SELECT * FROM users WHERE user_id = ?
`);

export {
    createUser,
    getUserById,
    getUserByUsername
}