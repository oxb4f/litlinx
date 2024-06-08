export class UserRefreshError extends Error {
	constructor(message = "User refresh error") {
		super(message);
		this.name = "UserRefreshError";
	}
}
