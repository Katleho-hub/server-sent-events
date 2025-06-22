import { SupabaseError } from "db/supabase/error.class.js";

export function handleError<
	T extends (arg0: unknown, arg1: number) => ReturnType<T>,
>(json: T, error: unknown): ReturnType<T> {
	if (error instanceof SupabaseError) {
		return json(error, error.status);
	}
	return json({ error: String(error) }, 500);
}
