export class CreateUserDtoOut {
	constructor(
		public readonly id: number,
		public readonly username: string,
		public readonly jwtAccess: string,
		public readonly name: string | null = null,
		public readonly birthday: string | null = null,
	) {}

	toJSON() {
		return Object.assign({}, this);
	}
}
