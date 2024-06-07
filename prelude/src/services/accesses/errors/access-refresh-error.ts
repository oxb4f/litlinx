export class AccessRefreshError extends Error {
	constructor(message = "Refresh is failed") {
		super(message);
		this.name = "AccessRefreshError";
	}
}
