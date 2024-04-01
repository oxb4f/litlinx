import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { AccessRepository } from "../../repositories/access";

const contextPlugin = fp(async function context(fastify: FastifyInstance) {
	fastify.decorateRequest("serviceContext", null);

	fastify.addHook("preHandler", (req, _reply, done) => {
		req.serviceContext = {
			accessRepository: new AccessRepository(fastify.db.connection),
			config: fastify.config,
		};
		done();
	});
});

export default contextPlugin;
