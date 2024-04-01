import Elysia, { t } from "elysia";
import { factory } from "../../services/users/create/create";
import { CreateUserDtoIn } from "../../services/users/create/dto-in";
import { contextPlugin } from "../plugins/context";

export const usersRoute = new Elysia({ name: "usersRoute" })
	.use(contextPlugin)
	.decorate("createUserService", factory())
	.group("/users", (app) =>
		app.post(
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
		),
	);
