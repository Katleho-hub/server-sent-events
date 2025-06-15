export class SupabaseError extends Error {
	status: number;
	context: string;
	args: unknown[];
	originalError?: unknown;

	constructor(
		message: string,
		status: number,
		context: string,
		args: unknown[],
		originalError?: unknown,
	) {
		super(message);
		this.name = "SupabaseError";
		this.status = status; // HTTP status code (e.g. 500)
		this.context = context;
		this.args = args;
		this.originalError = originalError;

		Error.captureStackTrace?.(this, SupabaseError);
	}
}

export type SupabaseErrorType = typeof SupabaseError;
export type SupabaseErrorInstance = InstanceType<SupabaseErrorType>;
