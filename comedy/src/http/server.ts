import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { match } from "ts-pattern";
import { ZodError } from "zod";
import { AuthLoginError } from "../services/auth/errors/auth-login-error";
import { UserAlreadyExistsError } from "../services/users/errors/user-already-exists-error";
import { contextPlugin } from "./plugins/context";
import { authRoute } from "./routes/auth";
import { usersRoute } from "./routes/users";

const serviceLayerErrors = [AuthLoginError, UserAlreadyExistsError] as const;

type ExtractEnumTypeFromArray<T extends readonly any[]> = T extends readonly [
	infer Head,
	...infer Tail,
]
	? Head extends { new (...args: any[]): infer O }
		? O | ExtractEnumTypeFromArray<Tail>
		: never
	: never;

function getErrorResponse(
	statusCode: number,
	errorType: string,
	message: string,
	data?: any,
) {
	return {
		statusCode,
		error: errorType,
		message,
		data,
	};
}

export const app = new Elysia()
	.use(swagger())
	.use(contextPlugin)
	.onError(({ error, set }) => {
		console.trace(error);
		const result = match(error)
			.when(
				(e) => e instanceof ZodError,
				(zodError: ZodError) => {
					set.status = 422;
					return getErrorResponse(
						422,
						"VALIDATION_ERROR",
						"Request validation error",
						zodError.errors.map((ve) => ({
							path: ve.path,
							message: ve.message,
						})),
					);
				},
			)
			.when(
				(e) => serviceLayerErrors.some((ec) => e instanceof ec),
				(matchedError: ExtractEnumTypeFromArray<typeof serviceLayerErrors>) => {
					set.status = 422;
					return getErrorResponse(
						422,
						"UNPROCESSABLE_ENTITY",
						matchedError.message,
					);
				},
			)
			.otherwise(() => {
				set.status = 500;
				return getErrorResponse(
					500,
					"INTERNAL_SERVER_ERROR",
					"Service is unavailable due to internal reasons",
				);
			});

		return result;
	})
	.get("/ping", () => ({ ping: "pong" }))
	.group("/api", (app) => app.use(usersRoute).use(authRoute))
	.listen({ port: Bun.env.APP_PORT }, () =>
		console.log(`🦊 Elysia is running at :${Bun.env.APP_PORT}`),
	);
