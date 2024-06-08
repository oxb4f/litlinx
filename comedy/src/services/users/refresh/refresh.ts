import z from "zod";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { UserRefreshError } from "../errors/user-refresh-error";
import type { RefreshDtoIn } from "./dto-in";
import { RefreshDtoOut } from "./dto-out";

async function refresh({
	dto,
	context,
}: {
	dto: RefreshDtoIn;
	context: Context;
}) {
	const user = await context.userRepository.getUser({
		externalAccessId: dto.accessId,
	});

	if (!user) throw new UserRefreshError();

	const result = await context.preludeHttpTransport.refresh(
		user.externalAccessId,
		dto.refreshToken,
	);

	return new RefreshDtoOut(result.jwtAccess, result.refreshToken);
}

export function factory() {
	return makeService(
		refresh,
		z.object({
			accessId: z.coerce.number().int().positive().max(999_999_999_999_999),
			refreshToken: z.string().max(256),
		}),
	);
}
