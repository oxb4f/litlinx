import { and, eq } from "drizzle-orm";
import { Access, type AccessPayload } from "../entities/access";
import { accesses } from "../infra/data-src/pg/schema";
import { BaseRepository } from "./base";

export type SelectAccess = typeof accesses.$inferSelect;

export class AccessRepository extends BaseRepository {
	async createFromEntity(access: Access) {
		const result = await this._connection
			.insert(accesses)
			.values({
				login: access.login,
				password: access.password,
				jwtPayload: access.jwtPayload,
				refreshTokens: Object.fromEntries(access.refreshTokens.entries()),
			})
			.returning({ id: accesses.id })
			.execute();

		access.id = result[0].id;

		return access;
	}

	async getAccess(selectBy: Partial<SelectAccess>) {
		const result = await this._connection
			.select({
				id: accesses.id,
				login: accesses.login,
				password: accesses.password,
				jwtPayload: accesses.jwtPayload,
				refreshTokens: accesses.refreshTokens,
			})
			.from(accesses)
			.where(
				and(
					...Object.keys(selectBy).map((k: keyof typeof selectBy) =>
						eq(accesses[k], selectBy[k]),
					),
				),
			)
			.limit(1)
			.execute();

		const raw = result?.[0];

		if (!raw?.id) return null;

		return Access.from(raw as AccessPayload);
	}

	async updateJwtPayloadFromEntity(access: Access) {
		await this._connection
			.update(accesses)
			.set({ jwtPayload: access.jwtPayload });
	}

	async updateFromEntity(access: Access) {
		if (!access.id) return;

		await this._connection
			.update(accesses)
			.set({
				login: access.login,
				password: access.password,
				refreshTokens: Object.fromEntries(access.refreshTokens.entries()),
			})
			.where(eq(accesses.id, access.id))
			.execute();
	}
}
