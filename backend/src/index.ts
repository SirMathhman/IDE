import Koa from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";
import Router from "koa-router";

function main() {
    const app = new Koa();
    app.use(cors());

    const router = new Router({
        prefix: "/file"
    });

    router.get("/", async context => {
        try {
            context.body = await fs.readdir(process.cwd());
        } catch (err) {
            context.status = 500;
            context.body = 'Error reading directory';
        }
    });

    router.get("/:child", async context => {
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
    });
    app.use(router.routes());

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}

main();
