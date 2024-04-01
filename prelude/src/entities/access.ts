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
};

export class Access {
	private _id: MaybeNumberId;
	private _login: string;
	private _password: string;
	private _jwtPayload: Record<string, any>;

	private constructor(payload: AccessPayload) {
		this._id = payload.id ?? null;
		this._login = payload.login;
		this._password = payload.password;
		this._jwtPayload = payload.jwtPayload;
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

	async setPassword(password: string): Promise<void> {
		this._password = await bcrypt.hash(password, SALT_ROUNDS);
	}

	async verifyPassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this._password);
	}

	async generateJwtAccess(secret: string, lifetime: number): Promise<string> {
		const signer = createSigner({
			key: async () => secret,
			expiresIn: lifetime,
		});

		return await signer({ ...this._jwtPayload, accessId: this._id });
	}

	static async verifyAndDecodeJwt(
		token: string,
		secret: string,
	): Promise<CompleteJwtPayload | null> {
		try {
			const verifier = createVerifier({ key: async () => secret });

			return await verifier(token);
		} catch (error) {
			if (error instanceof TokenError) return null;
			throw error;
		}
	}

	toPlainObject(): Readonly<Omit<AccessPayload, "password">> {
		return {
			id: this._id,
			login: this._login,
			jwtPayload: this._jwtPayload,
		};
	}
}
