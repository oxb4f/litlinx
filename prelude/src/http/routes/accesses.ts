import type { FastifyInstance, FastifyRequest } from "fastify";

import { factory as createFactory } from "../../services/accesses/create/create";
import type { CreateAccessDtoIn } from "../../services/accesses/create/dto-in";
import type { LoginDtoIn } from "../../services/accesses/login/dto-in";
import { factory as loginFactory } from "../../services/accesses/login/login";
import type { VerifyDtoIn } from "../../services/accesses/verify/dto-in";
import { factory as verifyFactory } from "../../services/accesses/verify/verify";

export default async function accesses(fastify: FastifyInstance) {
	const createAccess = createFactory();
	const login = loginFactory();
	const verify = verifyFactory();

	fastify.route({
		method: "POST",
		url: "/accesses",
		handler: async (req: FastifyRequest<{ Body: CreateAccessDtoIn }>) =>
			createAccess({
				dto: req.body,
				context: req.serviceContext,
			}),
	});

	fastify.route({
		method: "POST",
		url: "/accesses/login",
		handler: async (req: FastifyRequest<{ Body: LoginDtoIn }>) =>
			login({
				dto: req.body,
				context: req.serviceContext,
			}),
	});

	fastify.route({
		method: "POST",
		url: "/accesses/verify",
		handler: async (req: FastifyRequest<{ Body: VerifyDtoIn }>) =>
			verify({
				dto: req.body,
				context: req.serviceContext,
			}),
	});
}
