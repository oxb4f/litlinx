export class CreateAccessDtoIn {
	constructor(
		public readonly login: string,
		public readonly password: string,
		public readonly deviceId: string,
		public readonly jwtPayload: Record<string, any>,
	) {}
}
