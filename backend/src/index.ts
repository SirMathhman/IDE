import Koa from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";
import Router from "koa-router";
import {$Route, BadRequest, ContextWrapper, InternalServerErrorResponseFromError, OkResponse, Response} from "./http";
import {$AsyncResultUnknown, ThrowableOption} from "@ide/common";
import {JSUnknown} from "@ide/common/src/js";
import bodyParser from "koa-bodyparser";

async function readFiles(): Promise<Response> {
    return $AsyncResultUnknown(async () => await fs.readdir(process.cwd())).match(
        value => OkResponse(JSUnknown(value)),
        error => InternalServerErrorResponseFromError(error)
    );
}

async function readChild(context: ContextWrapper) {
    const params = context.routeParams;
    const child = params.get("child")
        .into(ThrowableOption)
        .orElseErr(() => BadRequest("No child response.")).$;

    const output = await $AsyncResultUnknown(async () => await fs.readFile(child))
        .mapErr(InternalServerErrorResponseFromError).$;

    return OkResponse(JSUnknown(output));
}

function findCurrentWorkingDirectory() {
    return Promise.resolve(OkResponse(JSUnknown(process.cwd())));
}

function createRoutes() {
    const router = new Router({
        prefix: "/"
    });

    router.get("/test", async context => {
        await $Route(findCurrentWorkingDirectory)(new ContextWrapper(context));
    });

    router.get("/:child", async context => {
        await $Route(readChild)(new ContextWrapper(context));
    });

    return router;
}

function main() {
    const app = new Koa();
    app.use(cors());
    app.use(bodyParser());

    let router = createRoutes();
    router.stack.forEach(layer => {
        console.log(layer.path);
    });

    let routes = router.routes();
    app.use(routes);

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}

main();
