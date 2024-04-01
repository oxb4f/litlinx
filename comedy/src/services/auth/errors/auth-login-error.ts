export class AuthLoginError extends Error {
	constructor(message = "Invalid credentials") {
		super(message);
		this.name = "AuthLoginError";
	}
}
