import z from "zod";

import { Access } from "../../../entities/access";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { JwtVerifyError } from "../errors/jwt-verify-error";
import type { VerifyDtoIn } from "./dto-in";

async function verify({
	dto,
	context,
}: {
	dto: VerifyDtoIn;
	context: Context;
}) {
	const decodedJwtAccess = await Access.verifyAndDecodeJwt(
		dto.jwtAccess,
		context.config.JWT_SECRET,
        dto.ignoreExpiration
	);

	if (!decodedJwtAccess?.accessId) throw new JwtVerifyError();

	const access = await context.accessRepository.getAccess({
		id: decodedJwtAccess.accessId,
	});

	if (!access) throw new JwtVerifyError();
}

export function factory() {
	return makeService(
		verify,
		z.object({
			jwtAccess: z.string().max(256),
			ignoreExpiration: z.boolean().optional(),
		}),
	);
}
