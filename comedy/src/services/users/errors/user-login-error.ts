export class UserLoginError extends Error {
	constructor(message = "User login error") {
		super(message);
		this.name = "UserLoginError";
	}
}
