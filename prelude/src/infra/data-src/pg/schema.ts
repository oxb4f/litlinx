import { json, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const accesses = pgTable("accesses", {
	id: serial("id").primaryKey(),
	login: varchar("login", { length: 128 }).notNull().unique(),
	password: varchar("password", { length: 64 }).notNull(),
	jwtPayload: json("jwt_payload").notNull(),
	refreshTokens: json("refresh_tokens").notNull(),
});
