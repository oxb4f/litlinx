import type { MaybeNumberId } from "./types/id";
import type { Optional } from "./types/optional";

export type Name = Optional<string>;
export type Birthday = Optional<Date>;

export type UserPayload = {
	id: MaybeNumberId;
	name: Name;
	username: string;
	birthday: Birthday;
	externalAccessId: number;
};

export class User {
	private _id: MaybeNumberId;
	private _name: Name;
	private _username: string;
	private _birthday: Birthday;
	private _externalAccessId: number;

	private constructor(payload: UserPayload) {
		this._id = payload.id ?? null;
		this._name = payload.name;
		this._username = payload.username;
		this._birthday = payload.birthday;
		this._externalAccessId = payload.externalAccessId;
	}

	static async from(payload: UserPayload): Promise<User> {
		return new User(payload);
	}

	get id() {
		return this._id;
	}

	set id(id: MaybeNumberId) {
		this._id = id;
	}

	get name(): Name {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get username() {
		return this._username;
	}

	set username(username: string) {
		this._username = username;
	}

	get birthday(): Birthday {
		return this._birthday;
	}

	getFormattedBirthday() {
		return this._birthday?.toUTCString() ?? null;
	}

	set birthday(birthday: Date) {
		this._birthday = birthday;
	}

	get externalAccessId() {
		return this._externalAccessId;
	}

	toPlainObject(): Readonly<Omit<UserPayload, "externalAccessId">> {
		return {
			id: this._id,
			name: this._name,
			username: this._username,
			birthday: this._birthday,
		};
	}
}
