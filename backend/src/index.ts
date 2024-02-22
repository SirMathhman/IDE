import Koa, {ParameterizedContext} from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";
import Router from "koa-router";
import {ContextWrapper, InternalServerErrorResponse, OkResponse, Response, RouteError} from "./http";
import {$AsyncResult, AsyncResult} from "./result";

function readFiles(): AsyncResult<Response, Error> {
    return $AsyncResult(async () => OkResponse(await fs.readdir(process.cwd()))).mapErr(RouteError);
}

async function readChild(context: ContextWrapper) {
    const params = context.params;
    const child = params["child"];

    if (!child) {
        context.status = 400;
        context.body = "No child provided.";
        return;
    }

    try {
        const output = await fs.readFile(child);
        context.status = 200;
        context.body = output;
    } catch (e) {
        context.status = 500;
        context.message = `Failed to read file at '${child}'.`;
    }
}

function createFileRoutes() {
    const router = new Router({
        prefix: "/file"
    });

    router.get("/", async context => {
        const response = await readFiles()
            .mapErr(InternalServerErrorResponse)
            .match(value => value, err => err);

        context.response.status = response.status;
        context.response.body = response.body;
    });

    router.get("/:child", readChild);
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
