import type { Optional } from "./optional";

type ToOptional<T> = Optional<T>;

export type MaybeNumberId = ToOptional<number>;
