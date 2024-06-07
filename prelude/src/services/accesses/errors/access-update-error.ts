export class AccessUpdateError extends Error {
	constructor(message = "Update is failed") {
		super(message);
		this.name = "AccessUpdateError";
	}
}
