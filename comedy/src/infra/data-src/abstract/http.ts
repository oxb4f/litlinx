import type { ZodSchema } from "zod";

class HttpStatusError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "HttpStatusError";
	}
}

class ResponseParsingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ResponseParsingError";
	}
}

export abstract class HttpTransport {
	protected static readonly HTTP_METHOD = {
		POST: "POST",
		GET: "GET",
		PUT: "PUT",
		DELETE: "DELETE",
	};

	constructor(protected readonly baseUrl: string) {}

	protected async request<T>(
		path: string,
		method: string,
		body: any,
		schema: ZodSchema<T>,
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method,
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" },
		});

		this.assertStatus(response);

		return this.parseBody(response, schema);
	}

	protected async parseBody<T>(response: Response, schema: ZodSchema<T>) {
		try {
			const requestBodyData = await schema.parseAsync(await response.json());

			return requestBodyData;
		} catch (error: any) {
			throw new ResponseParsingError(
				`Failed to parse response body: ${error.message}`,
			);
		}
	}

	protected assertStatus(response: Response) {
		if (Math.trunc(response.status / 100) !== 2) {
			throw new HttpStatusError(
				response.status,
				`Unexpected response status: ${response.status}`,
			);
		}
	}
}
