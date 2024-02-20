import Koa, {ParameterizedContext} from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";
import Router from "koa-router";

async function readFiles(context: ParameterizedContext) {
    try {
        context.body = await fs.readdir(process.cwd());
    } catch (err) {
        context.status = 500;
        context.body = 'Error reading directory';
    }
}

async function readChild(context: ParameterizedContext) {
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
    router.get("/", readFiles);
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
