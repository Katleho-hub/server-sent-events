import type { Tables } from "../database.types.js";
import { SupabaseError } from "../supabase-error.class.js";
import supabaseClient from "../index.js";

const todos = supabaseClient.from("todos");
export type Todo = Tables<"todos">;

/*------------------Create todo----------------------*/
async function createTodo(
	task: Todo["task"],
	public_id: Todo["public_id"],
): Promise<{ data: Todo; status: number }> {
	console.log({ task, public_id });
	const { data, error, status } = await todos
		.insert([{ task, public_id }])
		.select()
		.single();

	if (!error) return { data, status };

	throw new SupabaseError(
		"Something went wrong when trying to create a todo.",
		status,
		"DB Queries | createTodo",
		[task],
		error,
	);
}

/*------------------Get todos----------------------*/
async function getAllTodos(): Promise<{ data: Todo[]; status: number }> {
	const { data, error, status } = await todos.select();

	if (!error) return { data, status };

	throw new SupabaseError(
		"Something went wrong when trying to get all todos.",
		status,
		"DB Queries | getAllTodos",
		[],
		error,
	);
}

/*------------------Get single todo----------------------*/
async function getTodoById(
	id: Todo["public_id"],
): Promise<{ data: Todo[]; status: number }> {
	const { data, error, status } = await todos.select().eq("public_id", id);

	if (!error) return { data, status };

	throw new SupabaseError(
		"Something went wrong when trying to get todo by id.",
		status,
		"DB Queries | getTodoById",
		[id],
		error,
	);
}

/*------------------Update todo----------------------*/
async function updateTodo({
	public_id,
	...rest
}: Omit<Todo, "id" | "created_at">): Promise<{ status: number }> {
	const { error, status } = await todos
		.update({ public_id, ...rest })
		.eq("public_id", public_id);

	if (!error) return { status };

	throw new SupabaseError(
		"Something went wrong when trying to update todo.",
		status,
		"DB Queries | updateTodo",
		Object.values({ public_id, ...rest }),
		error,
	);
}

/*------------------Delete todo----------------------*/
async function deleteTodo(id: Todo["public_id"]): Promise<{ status: number }> {
	const { error, status } = await todos.delete().eq("public_id", id);

	if (!error) return { status };

	throw new SupabaseError(
		"Something went wrong when trying to delete todo.",
		status,
		"DB Queries | deleteTodo",
		[id],
		error,
	);
}

export { createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo };
