import * as assert from "assert";
import axios from "axios";
import {Context} from "koa";
import {DefaultApplication, run} from "../src";

describe('Jest', () => {
    it('should work fine', () => {
        assert.equal(true, true);
    });
});

describe('Within an integration context, a Koa server', () => {
    it('should be able to be connectable', async () => {
        const TEST_PORT = 3000;
        const TEST_VALUE = "test";

        function setup(koa: DefaultApplication): DefaultApplication {
            koa.use(function (context: Context) {
                context.response.body = TEST_VALUE;
                context.response.status = 200;
            });
            return koa;
        }

        await run(TEST_PORT, setup).use(async () => {
            const response = await axios({
                method: "get",
                url: `http://localhost:${TEST_PORT}`
            });

            expect(response.data).toBe(TEST_VALUE);
        });
    });
});
