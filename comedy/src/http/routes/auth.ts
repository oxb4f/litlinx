import Elysia, { t } from "elysia";
import { LoginInDto } from "../../services/auth/login/dto-in";
import { factory } from "../../services/auth/login/login";
import { contextPlugin } from "../plugins/context";

export const authRoute = new Elysia({ name: "authRoute" })
	.use(contextPlugin)
	.decorate("loginService", factory())
	.group("/auth", (app) =>
		app.post(
			"/login",
			async ({ body, context, loginService }) => {
				const result = await loginService({
					dto: new LoginInDto(body.username, body.password),
					context,
				});

				return result.toJSON();
			},
			{
				body: t.Object({
					username: t.String({
						description: "Username for access",
						examples: "username",
					}),
					password: t.String({
						description: "Password for access",
						examples: "password",
					}),
				}),
			},
		),
	);
