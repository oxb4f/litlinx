import z from "zod";
import { User } from "../../../entities/user";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import type { CreateUserDtoIn } from "./dto-in";
import { CreateUserDtoOut } from "./dto-out";

async function create({
	dto,
	context,
}: {
	dto: CreateUserDtoIn;
	context: Context;
}) {
	const existingUser = await context.userRepository.getUser({
		username: dto.username,
	});

	if (existingUser) throw new UserAlreadyExistsError();

	const response = await fetch(`${context.config.PRELUDE_BASE_URL}/accesses`, {
		method: "POST",
		body: JSON.stringify({
			login: dto.username,
			password: dto.password,
			jwtPayload: {},
		}),
		headers: { "Content-Type": "application/json" },
	});

	const body = await response.json();

	const externalAccessId = body.id as number;
	const jwtAccess = body.jwtAccess as string;

	const user = await User.from({
		id: null,
		name: dto.name,
		username: dto.username,
		birthday: dto.birthday ? new Date(dto.birthday) : null,
		externalAccessId: externalAccessId,
	});

	await context.userRepository.createFromEntity(user);

	return new CreateUserDtoOut(
		user.id!,
		user.username,
		jwtAccess,
		user.name,
		user.birthday?.toUTCString() ?? null,
	);
}

export function factory() {
	return makeService(
		create,
		z.object({
			name: z.string().max(64).optional(),
			username: z.string().max(64),
			password: z.string().min(8).max(64),
			birthday: z.coerce.date().optional(),
		}),
	);
}
