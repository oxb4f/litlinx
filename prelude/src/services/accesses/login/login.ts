import z from "zod";

import type { Context } from "../../context";
import { makeService } from "../../make";
import { AccessLoginError } from "../errors/access-login-error";
import type { LoginDtoIn } from "./dto-in";
import { LoginDtoOut } from "./dto-out";

async function login({ dto, context }: { dto: LoginDtoIn; context: Context }) {
	const access = await context.accessRepository.getAccess({
		login: dto.login,
	});

	if (!access) throw new AccessLoginError();

	const passwordVerifyResult = await access
		.verifyPassword(dto.password)
		.catch(() => {
			throw new AccessLoginError();
		});

	if (!passwordVerifyResult) throw new AccessLoginError();

	if (dto.jwtPayload) {
		access.jwtPayload = dto.jwtPayload;

		await context.accessRepository.updateJwtPayloadFromEntity(access);
	}

	access.deleteRefreshToken(dto.deviceId);

	const refreshToken = await access.addOrReplaceRefreshToken(
		dto.deviceId,
		context.config.JWT_SECRET,
		context.config.REFRESH_TOKEN_LIFETIME,
	);

	const jwtAccess = await access.generateJwtAccess(
		context.config.JWT_SECRET,
		context.config.JWT_ACCESS_LIFETIME,
	);

	return new LoginDtoOut(access.id!, access.login, refreshToken, jwtAccess);
}

export function factory() {
	return makeService(
		login,
		z.object({
			login: z.string().max(64),
			password: z.string().min(8).max(64),
			deviceId: z.string().min(8).max(256),
			jwtPayload: z.record(z.string(), z.any()).optional(),
		}),
	);
}
