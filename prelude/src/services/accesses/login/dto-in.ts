export class LoginDtoIn {
	constructor(
		public readonly login: string,
		public readonly password: string,
		public readonly jwtPayload: Record<string, any>,
	) {}
}
