import { createTodo, deleteTodo, getTodoById, getTodosByUserId, updateTodoCheckById } from "db/queries/todo.queries.js";
import { getUserById } from "db/queries/user.queries.js";
import { Hono } from "hono";
import { nanoid } from "nanoid";

const todosRouter = new Hono();
const defaultUserId = 'a-0S46G9RvsrrvhMNc80b';

// Create todo
todosRouter.post('/', async ({req, json}) => {
    const { title } = await req.parseBody<any>();
  
    if (!title) return json({ error: 'Missing Todo Title' }, 400);
  
    const fetchedUser: any = getUserById.get(defaultUserId);
    if (!fetchedUser) return json({ error: 'User not found' }, 400);
  
    const todoId = nanoid(6);
    const todoOwner = fetchedUser.user_id;
    const createdAt = Date.now();
    const addedTodo: any = createTodo.get(todoId, todoOwner, title, createdAt);
  
    return json({
      todoId,
      title,
      checked: Boolean(addedTodo.checked),
      joined: new Date(addedTodo.created_at).toISOString(),
    }, 201);
  });


// Get todos
todosRouter.get('/', ({req, json}) => {
    const fetchedUser = getUserById.get(defaultUserId);
    if (!fetchedUser) {
      return json({ error: 'Unauthenticated user' }, 400);
    }
    const todos = getTodosByUserId.all(defaultUserId);
    return json({message: todos.map(({ todo_id, title, checked, created_at }: any) => ({
        todoId: todo_id,
        title,
        checked: Boolean(checked),
        createdAt: new Date(created_at).toISOString(),
      }))}, 200);
  });

// Update todo  
todosRouter.patch('/:id', async ({req, json}) => {
    const { checked } = await req.parseBody();
    const todoId = req.param('id')
  
    const recordedTodo: any = getTodoById.get(todoId);
  
    if (!recordedTodo) {
      return json({ error: 'Todo not found' }, 404);
    }
  
    if (recordedTodo.todo_owner !== defaultUserId) {
      return json({ error: 'User unauthorized to update this todo' }, 401);
    }
  
    const checkedAt = Date.now();
  
    const updatedCheck = checked ? 1 : 0;
    const { todo_id, title, checked_at, created_at }: any = updateTodoCheckById.get(
      updatedCheck,
      checkedAt,
      recordedTodo.todo_owner,
      todoId
    );
  
    return json({
      message: 'Successfully checked todo',
      update: {
        todoId: todo_id,
        title,
        check: Boolean(updatedCheck),
        checkedAt: new Date(checked_at).toISOString(),
        createdAt: new Date(created_at).toISOString(),
      },
    }, 200);
  });

todosRouter.delete('/:id', async ({req, json}) => {
    const todoId = req.param('id')
    const recordedTodo: any = getTodoById.get(todoId);
    if (!recordedTodo) {
      return json({ error: 'Todo not found' }, 404);
    }
    if (recordedTodo.todo_owner !== defaultUserId) {
      return json({ error: 'User unauthorized to delete this todo' }, 401);
    }
    deleteTodo.run(todoId, defaultUserId);
    return json({ message: 'Todo successfully deleted!' }, 200);
  });
  
export default todosRouter;