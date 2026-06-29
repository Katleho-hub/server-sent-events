import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { handleError } from "./helpers/handle-error.helper.js";
import {
	createNewTodo,
	fetchAllTodos,
	fetchTodoById,
	modifyTodo,
	removeTodo,
} from "./service/todo.service.js";

const todosRouter = new Hono();

todosRouter.onError((err, c) => {
	return handleError(c, err);
});

todosRouter.post("/", async ({ req, json }) => {
	const { title } = await req.parseBody<{ title?: string }>();

	if (!title) return json({ error: "Missing Todo Title" }, 400);

	const formattedTodo = await createNewTodo(title);
	return json(formattedTodo, 201);
});

todosRouter.get("/", async ({ json }) => {
	const todos = await fetchAllTodos();
	return json({ todos }, 200);
});

todosRouter.get("/:id", async ({ req, json }) => {
	const todoId = req.param("id");
	const todos = await fetchTodoById(todoId);
	return json({ todos }, 200);
});

todosRouter.patch("/:id", async ({ req, json }) => {
	const todoId = req.param("id");
	const bodyData = await req.parseBody();

	// Call the shared helper
	const { status } = await modifyTodo(todoId, bodyData);

	return json(
		{ message: "Successfully updated todo" },
		status as ContentfulStatusCode,
	);
});

todosRouter.delete("/:id", async ({ req, json }) => {
	const todoId = req.param("id");
	await removeTodo(todoId);
	return json({ message: "Todo successfully deleted!" }, 200);
});

export default todosRouter;
