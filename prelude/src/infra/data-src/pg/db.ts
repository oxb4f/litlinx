import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { type ConnectionParams, buildConnectionString } from "./utils";

export type Connection = PostgresJsDatabase<typeof schema>;

let _connection: Connection;

export async function getConnection({
	user,
	password,
	db,
	host,
	port,
}: ConnectionParams): Promise<Connection> {
	const connectionString = buildConnectionString({
		user,
		password,
		db,
		host,
		port,
	});

	if (!_connection)
		_connection = drizzle(postgres(connectionString, { max: 5 }), { schema });

	return _connection;
}
