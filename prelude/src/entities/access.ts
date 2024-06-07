import bcrypt from "bcrypt";
import { TokenError, createSigner, createVerifier } from "fast-jwt";

import type { MaybeNumberId } from "./types/id";

const SALT_ROUNDS = 10;

export interface CompleteJwtPayload {
	[k: string]: any;

	accessId: MaybeNumberId;
}

export type AccessPayload = {
	id: MaybeNumberId;
	login: string;
	password: string;
	jwtPayload: Record<string, any>;
	refreshTokens: Record<string, string>;
};

export class Access {
	private _id: MaybeNumberId;
	private _login: string;
	private _password: string;
	private _jwtPayload: Record<string, any>;
	private _refreshTokens: Map<string, string>;

	private constructor(payload: AccessPayload) {
		this._id = payload.id ?? null;
		this._login = payload.login;
		this._password = payload.password;
		this._jwtPayload = payload.jwtPayload;
		this._refreshTokens = new Map(Object.entries(payload.refreshTokens));
	}

	static async from(payload: AccessPayload): Promise<Access> {
		return new Access({ ...payload });
	}

	get id(): MaybeNumberId {
		return this._id;
	}

	get login(): string {
		return this._login;
	}

	get password(): string {
		return this._password;
	}

	set login(login: string) {
		this._login = login;
	}

	set id(id: MaybeNumberId) {
		this._id = id;
	}

	get jwtPayload() {
		return this._jwtPayload;
	}

	set jwtPayload(jwtPayload: Record<string, any>) {
		this._jwtPayload = jwtPayload;
	}

	get refreshTokens(): Map<string, string> {
		return this._refreshTokens;
	}

	async setPassword(password: string): Promise<void> {
		this._password = await bcrypt.hash(password, SALT_ROUNDS);
	}

	async addOrReplaceRefreshToken(
		id: string,
		secret: string,
		lifetime: number,
	): Promise<string> {
		const refreshToken = await this.generateRefreshToken(secret, lifetime);

		this._refreshTokens.set(id, await bcrypt.hash(refreshToken, SALT_ROUNDS));

		return refreshToken;
	}

	deleteRefreshToken(id: string): void {
		this._refreshTokens.delete(id);
	}

	async verifyRefreshToken(id: string, refreshToken: string) {
		if (!this._refreshTokens.has(id)) return false;

		return await bcrypt.compare(
			refreshToken,
			this._refreshTokens.get(id) as string,
		);
	}

	async verifyPassword(password: string) {
		return await bcrypt.compare(password, this._password);
	}

	async generateJwtAccess(secret: string, lifetime: number) {
		return await this.#generateJwt(secret, lifetime, {
			...this._jwtPayload,
			accessId: this._id,
		});
	}

	async generateRefreshToken(secret: string, lifetime: number) {
		return await this.#generateJwt(secret, lifetime, { accessId: this._id });
	}

	async #generateJwt(
		secret: string,
		lifetime: number,
		payload: Record<string, unknown>,
	) {
		const signer = createSigner({
			key: async () => secret,
			expiresIn: lifetime,
		});

		return await signer({ ...payload });
	}

	static async verifyAndDecodeJwt(
		token: string,
		secret: string,
		ignoreExpiration = false,
	): Promise<CompleteJwtPayload | null> {
		try {
			const verifier = createVerifier({
				key: async () => secret,
				ignoreExpiration,
			});

			return await verifier(token);
		} catch (error) {
			if (error instanceof TokenError) return null;
			throw error;
		}
	}

	toPlainObject(): Readonly<Omit<AccessPayload, "password" | "refreshTokens">> {
		return {
			id: this._id,
			login: this._login,
			jwtPayload: this._jwtPayload,
		};
	}
}
