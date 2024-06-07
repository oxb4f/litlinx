import z from "zod";

import type { Context } from "../../context";
import { makeService } from "../../make";
import { AccessRefreshError } from "../errors/access-refresh-error";
import type { RefreshDtoIn } from "./dto-in";
import { RefreshDtoOut } from "./dto-out";

async function refresh({
	dto,
	context,
}: { dto: RefreshDtoIn; context: Context }) {
	const access = await context.accessRepository.getAccess({
		id: dto.accessId,
	});

	if (!access) throw new AccessRefreshError();

	const refreshTokenVerifyResult = await access
		.verifyRefreshToken(dto.deviceId, dto.refreshToken)
		.catch(() => {
			throw new AccessRefreshError();
		});

	if (!refreshTokenVerifyResult) throw new AccessRefreshError();

	access.deleteRefreshToken(dto.deviceId);

	const refreshToken = await access.addOrReplaceRefreshToken(
		dto.deviceId,
		context.config.JWT_SECRET,
		context.config.REFRESH_TOKEN_LIFETIME,
	);

	await context.accessRepository.updateFromEntity(access);

	const jwtAccess = await access.generateJwtAccess(
		context.config.JWT_SECRET,
		context.config.JWT_ACCESS_LIFETIME,
	);

	return new RefreshDtoOut(access.id!, access.login, refreshToken, jwtAccess);
}

export function factory() {
	return makeService(
		refresh,
		z.object({
			refreshToken: z.string().min(1).max(256),
			deviceId: z.string().min(8).max(256),
			accessId: z.coerce.number().min(1).max(999_999_999_999_999),
		}),
	);
}
