import {
	createTodo,
	deleteTodo,
	getAllTodos,
	getTodoById,
	updateTodo,
} from "db/queries/todo.queries.js";
import { nanoid } from "nanoid";
import { todoUpdateSchema } from "server/validation/todo.validation.js";
import { formatTodo } from "../helpers/format-todo.helper.js";

export const createNewTodo = async (title?: string) => {
	if (!title) throw new Error("Missing Todo Title");
	const todo = await createTodo(title, nanoid());
	return formatTodo(todo.data);
};

export const fetchAllTodos = async () => {
	const todos = await getAllTodos();
	return todos.data.map(formatTodo);
};

export const fetchTodoById = async (id: string) => {
	const todos = await getTodoById(id);
	return todos.data.map(formatTodo);
};

export const modifyTodo = async (
	id: string,
	updateData: Record<string, unknown>,
) => {
	const body = todoUpdateSchema.parse({
		...updateData,
		public_id: id,
	});

	const result = await updateTodo(body);
	return result;
};

export const removeTodo = async (id: string) => {
	await deleteTodo(id);
	return true;
};
