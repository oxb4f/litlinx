import { bigint, date, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 128 }),
	birthday: date("birthday"),
	username: varchar("username", { length: 128 }).notNull().unique(),
	externalAccessId: bigint("external_access_id", { mode: "number" })
		.notNull()
		.unique(),
});
