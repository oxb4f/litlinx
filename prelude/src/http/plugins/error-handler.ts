import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { match } from "ts-pattern";
import { ZodError } from "zod";
import { AccessDuplicationError } from "../../services/accesses/errors/access-duplication-error";
import { AccessLoginError } from "../../services/accesses/errors/access-login-error";
import { JwtVerifyError } from "../../services/accesses/errors/jwt-verify-error";

const serviceLayerErrors = [
    AccessLoginError,
    AccessDuplicationError,
    JwtVerifyError,
] as const;

const allErrors = [ ...serviceLayerErrors, ZodError, Error ] as const;

type ExtractEnumTypeFromArray<T extends readonly any[]> = T extends readonly [
	infer Head,
	...infer Tail,
]
	? Head extends { new (...args: any[]): infer O }
		? (O | ExtractEnumTypeFromArray<Tail>)
		: never
	: never;

function sendErrorResponse(
	reply: FastifyReply,
	statusCode: number,
	errorType: string,
	message: string,
	data?: any,
) {
	reply.status(statusCode).send({
		statusCode,
		error: errorType,
		message,
		data,
	});
}

const errorHandlerPlugin = fp(async function errorHandler(
	fastify: FastifyInstance,
) {
	fastify.setErrorHandler(
		(error: ExtractEnumTypeFromArray<typeof allErrors>, _req: FastifyRequest, reply: FastifyReply) => {
			match(error)
				.when(
					(e) => e instanceof ZodError,
					(zodError: ZodError) => {
						sendErrorResponse(
							reply,
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
						sendErrorResponse(
							reply,
							422,
							"UNPROCESSABLE_ENTITY",
							matchedError.message,
						);
					},
				)
				.otherwise((e) => {
					sendErrorResponse(
						reply,
						500,
						"INTERNAL_SERVER_ERROR",
						"Service is unavailable due to internal reasons",
					);
				});
		},
	);
});

export default errorHandlerPlugin;
