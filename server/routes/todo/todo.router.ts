import {
	createTodo,
	deleteTodo,
	getAllTodos,
	getTodoById,
	updateTodo,
} from "db/queries/todo.queries.js";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { todoUpdateSchema } from "server/validation/todo.validation.js";
import { formatTodo } from "./helpers/format-todo.helper.js";
import { handleError } from "./helpers/handle-error.helper.js";

const todosRouter = new Hono();

todosRouter.onError((err, c) => {
	return handleError(c.json, err);
});

/*------------------Create todo----------------------*/
todosRouter.post("/", async ({ req, json }) => {
	const { title } = await req.parseBody<{ title?: string }>();

	if (!title) return json({ error: "Missing Todo Title" }, 400);

	const todo = await createTodo(title, nanoid());

	return json(formatTodo(todo.data), 201);
});

/*------------------Get todos----------------------*/
todosRouter.get("/", async ({ req, json }) => {
	const todos = await getAllTodos();

	return json({ todos: todos.data.map((todo) => formatTodo(todo)) }, 200);
});

/*------------------Get single todo----------------------*/
todosRouter.get("/:id", async ({ req, json }) => {
	const todoId = req.param("id");

	const todos = await getTodoById(todoId);

	return json({ todos: todos.data.map((todo) => formatTodo(todo)) }, 200);
});

/*------------------Update todo----------------------*/
todosRouter.patch("/:id", async ({ req, json }) => {
	const todoId = req.param("id");

	const body = todoUpdateSchema.parse({
		...(await req.parseBody()),
		public_id: todoId,
	});

	await updateTodo(body);

	return json({ message: "Successfully updated todo" }, 200);
});

/*------------------Delete todo----------------------*/
todosRouter.delete("/:id", async ({ req, json }) => {
	const todoId = req.param("id");

	await deleteTodo(todoId);

	return json({ message: "Todo successfully deleted!" }, 200);
});

export default todosRouter;
