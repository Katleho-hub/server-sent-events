import type { Todo } from "db/supabase/queries/todo.queries.js";

export function formatTodo(todo: Todo) {
	return {
		todoId: todo.public_id,
		status: todo.status,
		title: todo.task,
		createdAt: new Date(todo.created_at ?? "").toLocaleTimeString(),
	};
}
