import { bearer } from "@elysiajs/bearer";
import { type Context, Elysia } from "elysia";

import { contextPlugin } from "../plugins/context";

function createErrorResponse(set: Context["set"]) {
	set.status = 401;
	set.headers["WWW-Authenticate"] =
		`Bearer realm='sign', error="invalid_request"`;

	return "Unauthorized";
}

function base64UrlDecode(base64Url: string): string {
	const sanitizedBase64Url = base64Url.replace(/-/g, "+").replace(/_/g, "/");

	const padding = "=".repeat((4 - (sanitizedBase64Url.length % 4)) % 4);

	const base64 = sanitizedBase64Url + padding;

	return Buffer.from(base64, "base64").toString("utf-8");
}

function decodeJwt(token: string): { accessId: number } {
	const parts = token.split(".");

	const payload = parts[1];

	const decodedPayload = base64UrlDecode(payload);

	return JSON.parse(decodedPayload);
}

export function createJwtAuthGuard(ignoreExpiration = false) {
	return new Elysia({ name: "jwtAuthGuard" })
		.use(contextPlugin)
		.use(bearer())
		.derive({ as: "scoped" }, ({ bearer }) => {
			if (!bearer) return {};

			const { accessId } = decodeJwt(bearer);

			return { accessId };
		})
		.onBeforeHandle(
			{ as: "global" },
			async ({ set, bearer, accessId, context }) => {
				if (!(bearer && accessId && context)) return createErrorResponse(set);

				try {
					await context.preludeHttpTransport.verify(bearer, ignoreExpiration);
				} catch {
					return createErrorResponse(set);
				}

				const user = await context.userRepository.getUser({
					externalAccessId: accessId,
				});

				if (!user) return createErrorResponse(set);
			},
		);
}
