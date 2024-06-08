import type { Config } from "../infra/config";
import type { PreludeHttpTransport } from "../infra/data-src/prelude/http";
import type { UserRepository } from "../repositories/user";

export interface Context {
	readonly config: Config;
	readonly userRepository: UserRepository;
	readonly preludeHttpTransport: PreludeHttpTransport;
}
