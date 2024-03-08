import Koa from "koa";
import Application, {ParameterizedContext} from "koa";
import {Once} from "./once";
import * as dotenv from "dotenv";
import Router from "koa-router";
import * as fs from "fs/promises";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";

dotenv.config();

export interface DefaultApplication extends Application<Application.DefaultState, Application.DefaultContext> {
}

export function run(port: number, setup: (koa: DefaultApplication) => DefaultApplication) {
    const koa = new Koa();
    const app = setup(koa);
    return Once(app.listen(port), server => server.close());
}

const DEFAULT_PORT = 3000;

function findPort() {
    const port = process.env["PORT"];
    if (port) {
        try {
            let parsedPort = parseInt(port);
            console.log(`Using user specified port of '${port}'.`);
            return parsedPort;
        } catch (e) {
            console.warn(`Failed to parse user specified port of '${port}'.`);
            console.log("Using default port of " + DEFAULT_PORT);
            return DEFAULT_PORT;
        }
    } else {
        console.log("Using default port of " + DEFAULT_PORT);
        return DEFAULT_PORT;
    }
}

async function main() {
    let actualPort = findPort();
    run(actualPort, app => {
        app.use(cors());
        app.use(bodyParser());

        const router = new Router();
        router.get("/list", async (context: ParameterizedContext) => {
            try {
                context.response.status = 200;
                context.response.body = await fs.readdir(".");
            } catch (e) {
                context.response.status = 500;
                context.response.body = "Failed to list local file.";
            }
        });
        router.post("/file", async context => {
            const {name} = context.request.body as Record<string, unknown | undefined>;
            if (name) {
                try {
                    context.response.status = 200;
                    context.response.body = await fs.readFile("./" + name);
                    return;
                } catch (e) {
                    context.response.status = 500;
                    context.response.body = (e as Error).message;
                }
            } else {
                context.response.status = 400;
                context.response.body = "No name provided.";
                return;
            }
        })

        app.use(router.routes());
        return app;
    });
}

main().catch(e => {
    console.error(e);
});
