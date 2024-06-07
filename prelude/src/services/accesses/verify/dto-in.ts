export class VerifyDtoIn {
	constructor(
		public readonly jwtAccess: string,
		public readonly ignoreExpiration?: boolean,
	) {}
}
