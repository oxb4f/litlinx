export type ConnectionParams = {
	user: string;
	password: string;
	db: string;
	host: string;
	port: number;
};

export function buildConnectionString({
	user,
	password,
	db,
	host,
	port,
}: ConnectionParams): string {
	return `postgres://${user}:${password}@${host}:${port}/${db}`;
}
