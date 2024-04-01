import { and, eq } from "drizzle-orm";
import { User, type UserPayload } from "../entities/user";
import { users } from "../infra/data-src/pg/schema";
import { BaseRepository } from "./base";

export type SelectUser = typeof users.$inferSelect;

export class UserRepository extends BaseRepository {
	async createFromEntity(user: User) {
		const result = await this._connection
			.insert(users)
			.values({
				name: user.name,
				username: user.username,
				birthday: user.birthday ? user.birthday.toUTCString() : null,
				externalAccessId: user.externalAccessId,
			})
			.returning({ id: users.id })
			.execute();

		user.id = result[0].id;

		return user;
	}

	async getUser(selectBy: Partial<SelectUser>) {
		const eqArray = [];
		for (const k of Object.keys(selectBy) as Array<keyof typeof selectBy>) {
			eqArray.push(eq(users[k], selectBy[k]!));
		}

		const result = await this._connection
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				birthday: users.birthday,
				externalAccessId: users.externalAccessId,
			})
			.from(users)
			.where(and(...eqArray))
			.limit(1)
			.execute();

		const raw = result?.[0];

		if (!raw?.id) return null;

		return User.from(raw as UserPayload);
	}
}
