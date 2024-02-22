import Application, {ParameterizedContext} from "koa";
import {AsyncResult} from "./result";
import {JSUnknown} from "./js";

export class ContextWrapper {
    private readonly context: ParameterizedContext;

    constructor(context: Application.ParameterizedContext) {
        this.context = context;
    }
}

export interface Response {
    body: unknown;
    status: number;
}

export function OkResponse(content: unknown): Response {
    return {
        status: 200,
        body: content
    }
}

export function InternalServerErrorResponse(error: Error): Response {
    return {
        status: 500,
        body: error
    }
}

export function RouteError(value: JSUnknown): Error {
    return new Error(value.asJSON());
}

type Route = (context: ContextWrapper) => AsyncResult<Response, Error>;
