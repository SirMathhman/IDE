import * as assert from "assert";
import axios from "axios";
import Koa from "koa";

describe('Jest', () => {
    it('should work fine', () => {
        assert.equal(true, true);
    });
});

const PORT = 3000;
const EXPECTED = "test";
describe('Within an integration context, a Koa server', () => {
    it('should be able to be connectable', async () => {
        const app = new Koa();
        app.use(context => {
            context.response.body = EXPECTED;
            context.response.status = 200;
        });

        const server = app.listen(PORT);

        const response = await axios({
            method: "get",
            url: `http://localhost:${PORT}`
        });

        expect(response.data).toBe(EXPECTED);

        server.close();
    });
});
