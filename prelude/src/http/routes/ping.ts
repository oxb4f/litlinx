import type { FastifyInstance } from "fastify";
import { factory } from "../../services/ping/get";

export default async function ping(fastify: FastifyInstance) {
	const getPing = factory();

	fastify.route({
		method: "GET",
		url: "/ping",
		handler: (req) => getPing({ context: req.serviceContext }),
	});
}
