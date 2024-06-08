import Elysia, { t } from "elysia";
import { factory as createUserServiceFactory } from "../../services/users/create/create";
import { CreateUserDtoIn } from "../../services/users/create/dto-in";
import { LoginDtoIn } from "../../services/users/login/dto-in";
import { factory as loginServiceFactory } from "../../services/users/login/login";
import { RefreshDtoIn } from "../../services/users/refresh/dto-in";
import { factory as refreshServiceFactory } from "../../services/users/refresh/refresh";
import { UpdateUserDtoIn } from "../../services/users/update/dto-in";
import { factory as updateServiceFactory } from "../../services/users/update/update";
import { createJwtAuthGuard } from "../guards/jwt-auth";
import { contextPlugin } from "../plugins/context";

export const usersRoute = new Elysia({ name: "usersRoute" })
	.use(contextPlugin)
	.decorate("createUserService", createUserServiceFactory())
	.decorate("loginService", loginServiceFactory())
	.decorate("updateService", updateServiceFactory())
	.decorate("refreshService", refreshServiceFactory())
	.group("/users", (app) =>
		app
			.post(
				"/",
				async ({ body, context, createUserService }) => {
					const result = await createUserService({
						dto: new CreateUserDtoIn(
							body.username,
							body.password,
							body.name,
							body.birthday,
						),
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
						birthday: t.Optional(
							t.Date({
								description: "Birthday of user",
								examples: "2024-05-25T22:23:33.807Z",
							}),
						),
						name: t.Optional(
							t.String({ description: "Name of user", examples: "name" }),
						),
					}),
				},
			)
			.post(
				"/login",
				async ({ body, context, loginService }) => {
					const result = await loginService({
						dto: new LoginDtoIn(body.username, body.password),
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
			)
			.guard(
				(app) =>
					app.use(createJwtAuthGuard(true)).post(
						"/refresh",
						async ({ body, context, accessId, refreshService }) => {
							const result = await refreshService({
								dto: new RefreshDtoIn(accessId as number, body.refreshToken),
								context,
							});

							return result.toJSON();
						},
						{
							body: t.Object({
								refreshToken: t.String({
									description: "Refresh token",
									examples: "token",
								}),
							}),
						},
					),
			)
			.guard(
				(app) =>
					app.use(createJwtAuthGuard()).patch(
						"/:userId",
						async ({ params, body, context, updateService }) => {
							const result = await updateService({
								dto: new UpdateUserDtoIn(
									params.userId,
									body.username,
									body.name,
									body.birthday,
								),
								context,
							});

							return result.toJSON();
						},
						{
							params: t.Object({
								userId: t.Numeric({
									description: "Id of user",
									examples: 1,
								}),
							}),
							body: t.Object({
								username: t.Optional(
									t.String({
										description: "Username for access",
										examples: "username",
									}),
								),
								birthday: t.Optional(
									t.Date({
										description: "Birthday of user",
										examples: "2024-05-25T22:23:33.807Z",
									}),
								),
								name: t.Optional(
									t.String({ description: "Name of user", examples: "name" }),
								),
							}),
						},
					),
			)
	);
