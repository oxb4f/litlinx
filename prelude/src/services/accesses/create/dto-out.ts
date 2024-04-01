export class CreateAccessDtoOut {
	constructor(
		public readonly id: number,
		public readonly login: string,
		public readonly jwtAccess: string,
	) {}
}
