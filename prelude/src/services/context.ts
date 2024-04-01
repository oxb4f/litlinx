import type { Config } from "../infra/config";
import type { AccessRepository } from "../repositories/access";

export interface Context {
	readonly config: Config;
	readonly accessRepository: AccessRepository;
}
