import Koa from "koa";
import {promises as fs} from "fs";
import cors from "@koa/cors";

const app = new Koa();
app.use(cors());

app.use(async ctx => {
    if (ctx.path === '/list') {
        try {
            ctx.body = await fs.readdir(process.cwd());
        } catch (err) {
            ctx.status = 500;
            ctx.body = 'Error reading directory';
        }
    } else {
        ctx.body = 'Welcome to the directory listing app';
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
