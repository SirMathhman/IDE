import Application, {ParameterizedContext} from "koa";
import {$AsyncResultToType} from "./result";
import {JSUnknown} from "./js";
import {jsMapFromRecord, Map} from "./collect";

export class ContextWrapper {
    private readonly context: ParameterizedContext;

    constructor(context: Application.ParameterizedContext) {
        this.context = context;
    }

    get routeParams(): Map<string, string> {
        const params: Record<string, string> = this.context.params ?? {};
        return jsMapFromRecord(params);
    }

    respondWith(response: Response) {
        this.context.status = response.status;
        this.context.body = response.body.unwrap();
    }
}

export interface Response {
    body: JSUnknown;
    status: number;
}

export function OkResponse(content: JSUnknown): Response {
    return {
        status: 200,
        body: content
    }
}

export function BadRequest(reason: string): Response {
    return {
        status: 400,
        body: JSUnknown(reason)
    }
}

export function InternalServerErrorResponseFromUnknown(error: JSUnknown): Response {
    return {
        status: 500,
        body: error
    }
}

export function $Route(route: (context: ContextWrapper) => Promise<Response>) {
    return async function (context: ContextWrapper) {
        const response = await $AsyncResultToType<Response, Response>(async () => await route(context))
            .match(value => value, err => err);

        context.respondWith(response)
    };
}
