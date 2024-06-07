export class RefreshDtoIn {
	constructor(
		public readonly accessId: number,
		public readonly deviceId: string,
		public readonly refreshToken: string,
	) {}
}
