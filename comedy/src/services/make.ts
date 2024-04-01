import type { ZodSchema } from "zod";
import type { Context } from "./context";

export type ActionDto<T extends Record<string, any> = Record<string, any>> = T;
export type ActionArg<
	T extends Record<string, any>,
	D extends ActionDto<T> = ActionDto<T>,
> = {
	dto: D;
	context: Context;
};
export type TAction<T extends Record<string, any>, R> = (
	arg: ActionArg<T>,
) => Promise<R>;

export function makeService<T extends Record<string, any>, R>(
	action: TAction<T, R>,
	validationSchema?: ZodSchema<T>,
) {
	const proxyHandler = {
		async apply(target: TAction<T, R>, thisArg: unknown, args: [ActionArg<T>]) {
			if (validationSchema)
				args[0].dto = await validationSchema.parseAsync(args[0].dto);

			return target.apply(thisArg, args);
		},
	};

	return new Proxy(action, proxyHandler);
}
