import { SupabaseError } from "db/error.class.js";
import type { HTTPResponseError } from "hono/types";
import { ZodError } from "zod/v4";

export function handleError<
	T extends (arg0: unknown, arg1: number) => ReturnType<T>,
>(
	json: T,
	error: Error | HTTPResponseError | ZodError | SupabaseError,
): ReturnType<T> {
	if (error instanceof SupabaseError) {
		return json(error, error.status);
	}

	if (isZodError(error)) {
		return json(error, 400);
	}

	return json(error, 500);
}

function isZodError(err: unknown): err is ZodError {
	return Boolean(
		err && (err instanceof ZodError || (err as ZodError).name === "ZodError"),
	);
}
