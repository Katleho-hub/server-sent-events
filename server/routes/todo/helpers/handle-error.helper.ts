import { SupabaseError } from "db/supabase-error.class.js";
import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

type SupportedError = Error | HTTPResponseError | ZodError | SupabaseError;

export function handleError({ json }: Context, error: SupportedError) {
	if (error instanceof SupabaseError) {
		return json(error, (error.status || 500) as ContentfulStatusCode);
	}

	if (error instanceof ZodError) {
		return json(error, 400);
	}

	return json(error, 500);
}
