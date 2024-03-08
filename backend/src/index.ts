import Koa from "koa";
import Application from "koa";
import {Once} from "./once";

export interface DefaultApplication extends Application<Application.DefaultState, Application.DefaultContext> {
}

export function run(port: number, setup: (koa: DefaultApplication) => DefaultApplication) {
    const koa = new Koa();
    const app = setup(koa);
    return Once(app.listen(port), server => server.close());
}

async function main() {
    run(3000, app => {
        return app;
    });
}

main().catch(e => {
    console.error(e);
});
