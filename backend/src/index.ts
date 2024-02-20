import Koa from "koa";
import {promises as fs} from "fs";

const app = new Koa();
app.use(async ctx => {
    if (ctx.path === '/list') {
        try {
            const files = await fs.readdir(process.cwd());
            ctx.body = files.join('\n');
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
