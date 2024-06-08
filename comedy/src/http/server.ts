import { randomUUID } from "node:crypto";
import { logger, serializers } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { TypeBoxError } from "@sinclair/typebox";
import { Elysia } from "elysia";
import { match } from "ts-pattern";
import { ZodError } from "zod";
import { UserAlreadyExistsError } from "../services/users/errors/user-already-exists-error";
import { UserLoginError } from "../services/users/errors/user-login-error";
import { UserRefreshError } from "../services/users/errors/user-refresh-error";
import { UserUpdateError } from "../services/users/errors/user-update-error";
import { contextPlugin } from "./plugins/context";
import { usersRoute } from "./routes/users";

const serviceLayerErrors = [
	UserAlreadyExistsError,
	UserRefreshError,
	UserUpdateError,
	UserLoginError,
] as const;

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
	.use(
		logger({
			serializers: {
				...serializers,
				request: (request: Request) => {
					const url = new URL(request.url);
					const headers = Object.fromEntries(request.headers.entries());

					const requestData = {
						id: request.headers.get("X-Request-ID") ?? randomUUID(),
						path: url.pathname,
						headers,
						requestDate: new Date().toISOString(),
						userAgent: headers["user-agent"] ?? "unknown",
						ip:
							headers["x-forwarded-for"] ??
							request.headers.get("X-Real-IP") ??
							"unknown",
					};

					return {
						...requestData,
						path: url.pathname,
					};
				},
			},
		}),
	)
	.onError(({ error, set }) => {
		const result = match(error)
			.when(
				(e: any) =>
					e instanceof ZodError ||
					e instanceof TypeBoxError ||
					e.code === "VALIDATION",
				(e: any) => {
					set.status = 422;

					let data = {};

					if (e.errors) {
						data = e.errors.map((ve: { path: string; message: string }) => ({
							path: ve.path,
							message: ve.message,
						}));
					}

					return getErrorResponse(
						422,
						"VALIDATION_ERROR",
						"Request validation error",
						data,
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
	.group("/api", (app) => app.use(usersRoute))
	.listen({ port: Bun.env.APP_PORT }, () =>
		console.log(`🦊 Elysia is running at :${Bun.env.APP_PORT}`),
	);
