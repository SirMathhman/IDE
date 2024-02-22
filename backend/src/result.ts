import {JSUnknown} from "./js";

interface Result<T, E> {

    mapErr<R>(mapper: (error: E) => R): Result<T, R>;

    match<R>(onOk: (value: T) => R, onErr: (error: E) => R): R;
}

function Ok<T, E>(value: T): Result<T, E> {
    return {
        mapErr<R>(): Result<T, R> {
            return Ok(value);
        },
        match<R>(onOk: (value: T) => R): R {
            return onOk(value);
        }
    }
}

function Err<T, E>(err: E): Result<T, E> {
    return {
        mapErr<R>(mapper: (error: E) => R): Result<T, R> {
            return Err(mapper(err));
        },
        match<R>(_: (value: T) => R, onErr: (error: E) => R): R {
            return onErr(err);
        }
    }
}

export class AsyncResult<T, E> {
    private readonly parent: Promise<Result<T, E>>;

    constructor(parent: Promise<Result<T, E>>) {
        this.parent = parent;
    }

    mapErr<R>(mapper: (error: E) => R) {
        return new AsyncResult(this.parent.then(value => {
            return value.mapErr(mapper);
        }));
    }

    async match<R>(onOk: (value: T) => R, onErr: (error: E) => R): Promise<R> {
        return this.parent.then(inner => {
            return inner.match(onOk, onErr);
        });
    }
}


export function $AsyncResult<T>(action: () => Promise<T>): AsyncResult<T, JSUnknown> {
    return new AsyncResult(new Promise<Result<T, JSUnknown>>(async (resolve) => {
        try {
            resolve(Ok(await action()));
        } catch (e) {
            resolve(Err(new JSUnknown(e)));
        }
    }));
}
