export class UpdateDtoIn {
	constructor(
		public readonly accessId: number,
		public readonly login?: string,
		public readonly password?: string,
	) {}
}
