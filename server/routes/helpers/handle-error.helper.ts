import type { FirebaseError } from "firebase-admin/app";
import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import { ZodError } from "zod";

type SupportedError = Error | HTTPResponseError | ZodError | FirebaseError;

export function handleError({ json }: Context, error: SupportedError) {
	if (error instanceof ZodError) {
		return json(error, 400);
	}

	return json(error, 500);
}
