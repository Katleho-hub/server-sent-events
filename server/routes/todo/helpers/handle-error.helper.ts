import { SupabaseError } from "db/supabase-error.class.js";
import type { HTTPResponseError } from "hono/types";
import { ZodError } from "zod/v3";

export function handleError<
	T extends (arg0: unknown, arg1: number) => ReturnType<T>,
>(
	json: T,
	error: Error | HTTPResponseError | ZodError | SupabaseError,
): ReturnType<T> {
	if (error instanceof SupabaseError) {
		return json(error, error.status);
	}

	if (error instanceof ZodError) {
		return json(error, 400);
	}

	return json(error, 500);
}
