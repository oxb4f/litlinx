import path from "node:path";

import auto from "@fastify/autoload";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import { getConnection } from "../infra/data-src/pg/db";
import { migrateDb } from "../infra/data-src/pg/migration";

const serverEntryPointPlugin = fp(async function serverEntryPoint(
	fastify: FastifyInstance,
) {
	await fastify.register(auto, {
		dir: path.join(__dirname, "plugins"),
		options: {},
	});

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	const dbConnCredentials = {
		user: fastify.config.POSTGRES_USER,
		password: fastify.config.POSTGRES_PASSWORD,
		db: fastify.config.POSTGRES_DB,
		host: fastify.config.POSTGRES_HOST,
		port: fastify.config.POSTGRES_PORT,
	};

	fastify.decorate("db", {
		connection: await getConnection(dbConnCredentials),
	});

	await migrateDb(dbConnCredentials);

	await fastify.register(auto, {
		dir: path.join(__dirname, "routes"),
		dirNameRoutePrefix: true,
		options: {},
	});
});

export default serverEntryPointPlugin;
