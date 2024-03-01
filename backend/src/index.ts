import Koa from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";
import Router from "koa-router";
import {$Route, BadRequest, ContextWrapper, InternalServerErrorResponseFromUnknown, OkResponse, Response} from "./http";
import {$AsyncResultUnknown, ThrowableOption} from "@ide/common";
import {JSUnknown} from "@ide/common/src/js";

async function readFiles(): Promise<Response> {
    try {
        return OkResponse(JSUnknown(await fs.readdir(process.cwd())));
    } catch (e) {
        return InternalServerErrorResponseFromUnknown(JSUnknown(e));
    }
}

async function readChild(context: ContextWrapper) {
    const params = context.routeParams;
    const child = params.get("child")
        .into(ThrowableOption)
        .orElseErr(() => BadRequest("No child response.")).$;

    const output = await $AsyncResultUnknown(async () => await fs.readFile(child))
        .mapErr(InternalServerErrorResponseFromUnknown).$;

    return OkResponse(JSUnknown(output));
}

function createFileRoutes() {
    const router = new Router({
        prefix: "/file"
    });

    router.get("/", async context => {
        await $Route(readFiles)(new ContextWrapper(context));
    });

    router.get("/:child", async context => {
        await $Route(readChild)(new ContextWrapper(context));
    });

    return router;
}

function main() {
    const app = new Koa();
    app.use(cors());
    app.use(createFileRoutes().routes());

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}

main();
