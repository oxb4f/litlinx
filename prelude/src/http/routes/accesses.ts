import crypto from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { RefreshDtoIn } from "src/services/accesses/refresh/dto-in";
import type { UpdateDtoIn } from "src/services/accesses/update/dto-in";
import { factory as createFactory } from "../../services/accesses/create/create";
import type { CreateAccessDtoIn } from "../../services/accesses/create/dto-in";
import type { LoginDtoIn } from "../../services/accesses/login/dto-in";
import { factory as loginFactory } from "../../services/accesses/login/login";
import { factory as refreshFactory } from "../../services/accesses/refresh/refresh";
import { factory as updateFactory } from "../../services/accesses/update/update";
import type { VerifyDtoIn } from "../../services/accesses/verify/dto-in";
import { factory as verifyFactory } from "../../services/accesses/verify/verify";

function generateUserAgentHash(userAgent?: string) {
	return crypto
		.createHash("sha256")
		.update(userAgent ?? "default")
		.digest("base64");
}

export default async function accesses(fastify: FastifyInstance) {
	const createAccess = createFactory();
	const login = loginFactory();
	const verify = verifyFactory();
	const refresh = refreshFactory();
	const update = updateFactory();

	fastify.route({
		method: "POST",
		url: "/accesses",
		handler: async (
			req: FastifyRequest<{ Body: Omit<CreateAccessDtoIn, "deviceId"> }>,
		) =>
			createAccess({
				dto: {
					...req.body,
					deviceId: generateUserAgentHash(req.headers["user-agent"]),
				},
				context: req.serviceContext,
			}),
	});

	fastify.route({
		method: "POST",
		url: "/accesses/login",
		handler: async (
			req: FastifyRequest<{ Body: Omit<LoginDtoIn, "deviceId"> }>,
		) =>
			login({
				dto: {
					...req.body,
					deviceId: generateUserAgentHash(req.headers["user-agent"]),
				},
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

	fastify.route({
		method: "POST",
		url: "/accesses/:accessId/refresh",
		handler: async (
			req: FastifyRequest<{
				Body: Omit<RefreshDtoIn, "accessId" | "deviceId">;
				Params: { accessId: InstanceType<typeof RefreshDtoIn>["accessId"] };
			}>,
		) =>
			refresh({
				dto: {
					...req.body,
					...req.params,
					deviceId: generateUserAgentHash(req.headers["user-agent"]),
				},
				context: req.serviceContext,
			}),
	});

	fastify.route({
		method: "POST",
		url: "/accesses/:accessId",
		handler: async (
			req: FastifyRequest<{
				Body: Omit<UpdateDtoIn, "accessId">;
				Params: { accessId: InstanceType<typeof UpdateDtoIn>["accessId"] };
			}>,
		) =>
			update({
				dto: { ...req.body, ...req.params },
				context: req.serviceContext,
			}),
	});
}
