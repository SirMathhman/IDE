import * as assert from "assert";
import axios from "axios";
import Koa, {Context} from "koa";

describe('Jest', () => {
    it('should work fine', () => {
        assert.equal(true, true);
    });
});

interface Once<T> {
    value: T;

    use(action: () => Promise<void>): Promise<void>;
}

function Once<T>(value: T, close: (value: T) => void): Once<T> {
    return {
        value,
        async use(action: (value: T) => Promise<void>) {
            await action(value);
            close(value);
        }
    }
}

const PORT = 3000;
const EXPECTED = "test";
describe('Within an integration context, a Koa server', () => {
    it('should be able to be connectable', async () => {
        const app = new Koa().use(function (context: Context) {
            context.response.body = EXPECTED;
            context.response.status = 200;
        });

        await Once(app.listen(PORT), server => server.close()).use(async () => {
            const response = await axios({
                method: "get",
                url: `http://localhost:${PORT}`
            });

            expect(response.data).toBe(EXPECTED);
        });
    });
});
