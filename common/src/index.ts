import {Err, Ok, Result} from "./result";

export * from "./option";
export * from "./result";
export * from "./stream";

export function parseString(value: unknown): Result<string, CastError> {
    return typeof value === "string"
        ? Ok(value)
        : Err(new CastError(value, "string"));
}

export class CastError extends Error {
    constructor(value: unknown, expectedType: string) {
        super(`Expected a type of '${expectedType}' but was actually '${typeof value}' for value:\n${value}`);
    }
}
