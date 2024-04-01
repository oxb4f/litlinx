import z from "zod";

import type { Context } from "../../context";
import { makeService } from "../../make";
import { AuthLoginError } from "../errors/auth-login-error";
import type { LoginInDto } from "./dto-in";
import { LoginOutDto } from "./dto-out";

async function login({
	dto,
	context,
}: {
	dto: LoginInDto;
	context: Context;
}) {
	const user = await context.userRepository.getUser({ username: dto.username });

	if (!user) throw new AuthLoginError();

	const response = await fetch(
		`${context.config.PRELUDE_BASE_URL}/accesses/login`,
		{
			method: "POST",
			body: JSON.stringify({
				login: dto.username,
				password: dto.password,
				jwtPayload: {},
			}),
			headers: { "Content-Type": "application/json" },
		},
	);

	const body = await response.json();

	if (body?.error) throw new AuthLoginError();

	const jwtAccess = body.jwtAccess as string;

	return new LoginOutDto(
		user.id!,
		user.username,
		jwtAccess,
		user.name,
		user.birthday?.toUTCString() ?? null,
	);
}

export function factory() {
	return makeService(
		login,
		z.object({
			username: z.string().max(64),
			password: z.string().min(8).max(64),
		}),
	);
}
