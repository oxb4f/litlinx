import z from "zod";
import type { Context } from "../../context";
import { makeService } from "../../make";
import { UserLoginError } from "../errors/user-login-error";
import type { LoginDtoIn } from "./dto-in";
import { LoginDtoOut } from "./dto-out";

async function login({
	dto,
	context,
}: {
	dto: LoginDtoIn;
	context: Context;
}) {
	const result = await context.preludeHttpTransport.login(
		dto.username,
		dto.password,
	);

	const user = await context.userRepository.getUser({
		externalAccessId: result.id,
	});

	if (!user) throw new UserLoginError();

	return new LoginDtoOut(
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
		login,
		z.object({
			username: z.string().max(64),
			password: z.string().min(8).max(64),
		}),
	);
}
