import z from "zod";

import type { Context } from "../../context";
import { makeService } from "../../make";
import { AccessUpdateError } from "../errors/access-update-error";
import type { UpdateDtoIn } from "./dto-in";
import { UpdateDtoOut } from "./dto-out";

async function update({
	dto,
	context,
}: { dto: UpdateDtoIn; context: Context }) {
	const access = await context.accessRepository.getAccess({
		id: dto.accessId,
	});

	if (!access) throw new AccessUpdateError();

	if (dto.login) access.login = dto.login;
	if (dto.password) await access.setPassword(dto.password);

	await context.accessRepository.updateFromEntity(access);

	return new UpdateDtoOut(access.id!, access.login);
}

export function factory() {
	return makeService(
		update,
		z.object({
			accessId: z.coerce.number().min(1).max(999_999_999_999_999),
			login: z.string().max(64).optional(),
			password: z.string().min(8).max(64).optional(),
		}),
	);
}
