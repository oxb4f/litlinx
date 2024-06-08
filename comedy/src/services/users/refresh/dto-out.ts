export class RefreshDtoOut {
	constructor(
		public readonly jwtAccess: string,
		public readonly refreshToken: string,
	) {}

	toJSON() {
		return Object.assign({}, this);
	}
}
