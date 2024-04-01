import { makeService } from "../make";

async function get() {
	return { ping: "pong" } as const;
}

export function factory() {
	return makeService(get);
}
