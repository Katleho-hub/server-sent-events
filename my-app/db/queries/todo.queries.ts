import db from "../my-db.js";

const createTodo = db.prepare(`
    INSERT INTO todos (todo_id, todo_owner, title, created_at)
    VALUES (?, ?, ?, ?)
    RETURNING todo_id, title, checked, created_at
`);
  
const getTodosByUserId = db.prepare(`
    SELECT * FROM todos WHERE todo_owner = ?
`);
  
const getTodoById = db.prepare(`
    SELECT * FROM todos WHERE todo_id = ?
`);
  
const updateTodoCheckById = db.prepare(`
    UPDATE todos SET checked = ?, checked_at = ? WHERE todo_owner = ? AND todo_id = ? 
    RETURNING todo_id, title, checked_at, created_at
`);
  
const deleteTodo = db.prepare(`
    DELETE from todos WHERE todo_id = ? AND todo_owner = ?  
`);

export {
    createTodo,
    getTodosByUserId,
    getTodoById,
    updateTodoCheckById,
    deleteTodo,
  };