export class AccessLoginError extends Error {
	constructor(message = "Invalid credentials") {
		super(message);
		this.name = "AccessLoginError";
	}
}
