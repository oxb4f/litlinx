export class RefreshDtoIn {
	constructor(
		public readonly accessId: number,
		public readonly refreshToken: string,
	) {}
}
