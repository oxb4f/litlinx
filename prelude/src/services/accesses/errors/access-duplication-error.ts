export class AccessDuplicationError extends Error {
	constructor(message = "Access already exists") {
		super(message);
		this.name = "AccessDuplicationError";
	}
}
