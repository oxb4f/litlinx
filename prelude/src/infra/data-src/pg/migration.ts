import * as path from "node:path";

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { getConnection } from "./db";
import type { ConnectionParams } from "./utils";

export async function migrateDb({
	user,
	password,
	db,
	host,
	port,
}: ConnectionParams): Promise<void> {
	const connection = await getConnection({
		user,
		password,
		db,
		host,
		port,
	});

	return migrate(connection, {
		migrationsFolder: path.join(process.cwd(), "migrations"),
	});
}
