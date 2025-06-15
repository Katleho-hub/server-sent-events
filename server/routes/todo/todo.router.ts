import {
	createTodo2,
	deleteTodo,
	getAllTodos,
	getTodoById,
	updateTodo,
} from "db/supabase/queries/todo.queries.js";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { todoUpdateSchema } from "server/validation/todo.validation.js";
import { formatTodo } from "./helpers/format-todo.helper.js";
import { handleError } from "./helpers/handle-error.helper.js";

const todosRouter = new Hono();

/*------------------Create todo----------------------*/
todosRouter.post("/", async ({ req, json }) => {
	const { title } = await req.parseBody<{ title?: string }>();

	if (!title) return json({ error: "Missing Todo Title" }, 400);
	try {
		const todo = await createTodo2(title, nanoid());
		return json(formatTodo(todo.data), 201);
	} catch (error: unknown) {
		return handleError(json, error);
	}
});

/*------------------Get todos----------------------*/
todosRouter.get("/", async ({ req, json }) => {
	try {
		const todos = await getAllTodos();
		return json({ todos: todos.data.map((todo) => formatTodo(todo)) }, 200);
	} catch (error: unknown) {
		return handleError(json, error);
	}
});

/*------------------Get single todo----------------------*/
todosRouter.get("/:id", async ({ req, json }) => {
	const todoId = req.param("id");

	if (!todoId) return json({ error: "Missing Todo id" }, 400);

	try {
		const todos = await getTodoById(todoId);
		return json({ todos: todos.data.map((todo) => formatTodo(todo)) }, 200);
	} catch (error: unknown) {
		return handleError(json, error);
	}
});

/*------------------Update todo----------------------*/
todosRouter.patch("/:id", async ({ req, json }) => {
	const public_id = req.param("id");

	if (!public_id) return json({ error: "Missing Todo id" }, 400);

	try {
		const body = todoUpdateSchema.parse({
			...(await req.parseBody()),
			public_id,
		});
		await updateTodo(body);
		return json({ message: "Successfully updated todo" }, 200);
	} catch (error: unknown) {
		return handleError(json, error);
	}
});

/*------------------Delete todo----------------------*/
todosRouter.delete("/:id", async ({ req, json }) => {
	const todoId = req.param("id");

	if (!todoId) return json({ error: "Missing Todo id" }, 400);

	try {
		await deleteTodo(todoId);
		return json({ message: "Todo successfully deleted!" }, 200);
	} catch (error: unknown) {
		return handleError(json, error);
	}
});

export default todosRouter;
