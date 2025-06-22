import type { Todo } from "db/queries/todo.queries.js";
import z from "zod";

const status = [
	"preparing",
	"next",
	"ready for pickup",
] as const satisfies Array<Todo["status"]>;

export const todoUpdateSchema = z.object({
	public_id: z.string(),
	status: z.enum(status),
	task: z.string().nullable(),
});
