import { z } from "zod";
import { HttpTransport } from "../abstract/http";

export class PreludeHttpTransport extends HttpTransport {
	async createAccess(username: string, password: string) {
		return this.request(
			"/accesses",
			HttpTransport.HTTP_METHOD.POST,
			{
				login: username,
				password: password,
				jwtPayload: {},
			},
			z.object(this.getValidationEntries()),
		);
	}

	async login(username: string, password: string) {
		return this.request(
			"/accesses/login",
			HttpTransport.HTTP_METHOD.POST,
			{
				login: username,
				password: password,
			},
			z.object(this.getValidationEntries()),
		);
	}

	async updateAccess(accessId: number, username: string) {
		await this.request(
			`/accesses/${accessId}`,
			HttpTransport.HTTP_METHOD.POST,
			{
				login: username,
			},
			z.unknown(),
		);
	}

	async refresh(accessId: number, refreshToken: string) {
		return this.request(
			`/accesses/${accessId}/refresh`,
			HttpTransport.HTTP_METHOD.POST,
			{
				refreshToken,
			},
			z.object(this.getValidationEntries()),
		);
	}

	async verify(jwtAccess: string, ignoreExpiration: boolean) {
		await this.request(
			"/accesses/verify",
			HttpTransport.HTTP_METHOD.POST,
			{
				jwtAccess,
				ignoreExpiration,
			},
			z.unknown(),
		);
	}

	private getValidationEntries() {
		return {
			id: z.coerce.number().int().positive().max(999_999_999_999_999),
			login: z.string(),
			refreshToken: z.string(),
			jwtAccess: z.string(),
		};
	}
}
