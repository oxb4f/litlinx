export class JwtVerifyError extends Error {
	constructor(message = "Invalid JWT") {
		super(message);
		this.name = "JwtVerifyError";
	}
}
