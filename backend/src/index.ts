import Koa from "koa";
import Application from "koa";
import {Once} from "./once";
import * as dotenv from "dotenv";

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
        return app;
    });
}

main().catch(e => {
    console.error(e);
});
