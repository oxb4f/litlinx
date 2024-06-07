import z from "zod";

import { Access } from "../../../entities/access";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { AccessDuplicationError } from "../errors/access-duplication-error";
import type { CreateAccessDtoIn } from "./dto-in";
import { CreateAccessDtoOut } from "./dto-out";

async function create({
	dto,
	context,
}: {
	dto: CreateAccessDtoIn;
	context: Context;
}) {
	const existingAccess = await context.accessRepository.getAccess({
		login: dto.login,
	});

	if (existingAccess) throw new AccessDuplicationError();

	const access = await Access.from({
		id: null,
		login: dto.login,
		password: dto.password,
		jwtPayload: dto.jwtPayload,
		refreshTokens: {},
	});

	await access.setPassword(dto.password);

	const refreshToken = await access.addOrReplaceRefreshToken(
		dto.deviceId,
		context.config.JWT_SECRET,
		context.config.REFRESH_TOKEN_LIFETIME,
	);

	await context.accessRepository.createFromEntity(access);

	const jwtAccess = await access.generateJwtAccess(
		context.config.JWT_SECRET,
		context.config.JWT_ACCESS_LIFETIME,
	);

	return new CreateAccessDtoOut(
		access.id!,
		access.login,
		refreshToken,
		jwtAccess,
	);
}

export function factory() {
	return makeService(
		create,
		z.object({
			login: z.string().max(64),
			password: z.string().min(8).max(64),
			deviceId: z.string().min(8).max(256),
			jwtPayload: z.record(z.string(), z.any()),
		}),
	);
}
