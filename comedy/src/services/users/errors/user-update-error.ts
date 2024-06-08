export class UserUpdateError extends Error {
	constructor(message = "User update error") {
		super(message);
		this.name = "UserUpdateError";
	}
}
