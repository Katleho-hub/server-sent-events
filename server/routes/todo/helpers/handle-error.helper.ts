import { SupabaseError } from "db/supabase/error.class.js";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function handleError(json: any, error: unknown) {
	if (error instanceof SupabaseError) {
		return json(error, error.status);
	}
	return json({ error: String(error) }, 500);
}
