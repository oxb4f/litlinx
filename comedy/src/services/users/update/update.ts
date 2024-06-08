import z from "zod";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { UserUpdateError } from "../errors/user-update-error";
import type { UpdateUserDtoIn } from "./dto-in";
import { UpdateUserDtoOut } from "./dto-out";

async function update({
	dto,
	context,
}: {
	dto: UpdateUserDtoIn;
	context: Context;
}) {
	const user = await context.userRepository.getUser({
		id: dto.userId,
	});

	if (!user) throw new UserUpdateError("User not found");

	if (dto.username) {
		await context.preludeHttpTransport.updateAccess(
			user.externalAccessId,
			dto.username,
		);

		user.username = dto.username;
	}

	if (dto.name) user.name = dto.name;
	if (dto.birthday) user.birthday = dto.birthday;

	await context.userRepository.updateFromEntity(user);

	return new UpdateUserDtoOut(
		user.id!,
		user.username,
		user.name,
		user.getFormattedBirthday(),
	);
}

export function factory() {
	return makeService(
		update,
		z.object({
			userId: z.coerce.number().int().positive().max(999_999_999_999_999),
			name: z.string().max(64).optional(),
			username: z.string().max(64).optional(),
			birthday: z.coerce.date().optional(),
		}),
	);
}
