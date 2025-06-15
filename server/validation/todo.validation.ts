import type { Todo } from "db/supabase/queries/todo.queries.js";
import z from "zod";

// https://github.com/Microsoft/TypeScript/issues/27024
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
	? 1
	: 2
	? true
	: false;

type AssertEqual<X, Y> = Equals<X, Y> extends true
	? true
	: ["Type Mismatch", X, Y];

const status = ["preparing", "next", "ready for pickup"] as const;

export const todoUpdateSchema = z.object({
	public_id: z.string(),
	status: z.enum(status),
	task: z.string().nullable(),
});

type Test = AssertEqual<
	//    ^?
	Omit<Todo, "id" | "created_at">,
	z.infer<typeof todoUpdateSchema>
>;
