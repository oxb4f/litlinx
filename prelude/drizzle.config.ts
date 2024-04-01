import path from "node:path";

import type { Config } from "drizzle-kit";

export default {
	schema: path.join("src", "infra", "data-src", "pg", "schema.ts"),
	out: "migrations",
	dialect: "postgresql",
	verbose: !!process.env.DB_QUERY_LOGS,
	dbCredentials: {
		host: process.env.POSTGRES_HOST!,
		user: process.env.POSTGRES_USER!,
		password: process.env.POSTGRES_PASSWORD!,
		database: process.env.POSTGRES_DB!,
		port: Number(process.env.POSTGRES_PORT),
	},
} satisfies Config;
