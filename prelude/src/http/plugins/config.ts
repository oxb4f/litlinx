import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { type Config, load } from "../../infra/config";

const configPlugin = fp(async function config(fastify: FastifyInstance) {
	fastify.decorate<Config>("config", load());
});

export default configPlugin;
