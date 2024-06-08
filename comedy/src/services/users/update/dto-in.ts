export class UpdateUserDtoIn {
	constructor(
		public readonly userId: number,
		public readonly username?: string,
		public readonly name?: string,
		public readonly birthday?: Date,
	) {}
}
