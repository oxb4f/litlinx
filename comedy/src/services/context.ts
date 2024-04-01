import type { Config } from "../infra/config";
import type { UserRepository } from "../repositories/user";

export interface Context {
	readonly config: Config;
	readonly userRepository: UserRepository;
}
