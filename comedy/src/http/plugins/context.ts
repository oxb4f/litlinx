import { Elysia } from "elysia";
import { load } from "../../infra/config";
import { getConnection } from "../../infra/data-src/pg/db";
import { migrateDb } from "../../infra/data-src/pg/migration";
import { PreludeHttpTransport } from "../../infra/data-src/prelude/http";
import { UserRepository } from "../../repositories/user";
import type { Context } from "../../services/context";

export const contextPlugin = new Elysia({ name: "contextPlugin" }).derive(
	{ as: "scoped" },
	async () => {
		const config = load();

		const dbCredentials = {
			user: config.POSTGRES_USER,
			port: config.POSTGRES_PORT,
			db: config.POSTGRES_DB,
			host: config.POSTGRES_HOST,
			password: config.POSTGRES_PASSWORD,
		};

		const dbConnection = await getConnection(dbCredentials);

		await migrateDb(dbCredentials);

		return {
			context: {
				config: load(),
				userRepository: new UserRepository(dbConnection),
				preludeHttpTransport: new PreludeHttpTransport(config.PRELUDE_BASE_URL),
			} satisfies Context,
		};
	},
);
