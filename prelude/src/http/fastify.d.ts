import "fastify";
import type { Config } from "../infra/config";
import type { Connection } from "../infra/data-src/pg/db";
import type { Context } from "../services/context";

declare module "fastify" {
	interface FastifyInstance {
		db: { connection: Connection };
		config: Config;
	}

	interface FastifyRequest {
		serviceContext: Context;
	}
}
