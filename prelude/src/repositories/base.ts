import type { Connection } from "../infra/data-src/pg/db";

export abstract class BaseRepository {
	constructor(protected _connection: Connection) {}
}
