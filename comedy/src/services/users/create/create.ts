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

	const result = await context.preludeHttpTransport.createAccess(
		dto.username,
		dto.password,
	);

	const user = await User.from({
		id: null,
		name: dto.name,
		username: dto.username,
		birthday: dto.birthday,
		externalAccessId: result.id,
	});

	await context.userRepository.createFromEntity(user);

	return new CreateUserDtoOut(
		user.id!,
		user.username,
		result.jwtAccess,
		result.refreshToken,
		user.name,
		user.getFormattedBirthday(),
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
