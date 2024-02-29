export interface Result<T, E> {
    mapErr<R>(mapper: (e: E) => R): Result<T, R>;

    mapValueToResult<R>(mapper: (value: T) => Result<R, E>): Result<R, E>;

    match<R>(onOk: (value: T) => R, onErr: (e: E) => R): R;
}

export function Ok<T, E>(value: T): Result<T, E> {
    return {
        mapErr<R>(): Result<T, R> {
            return Ok(value);
        },
        mapValueToResult<R>(mapper: (value: T) => Result<R, E>): Result<R, E> {
            return mapper(value);
        },
        match<R>(onOk: (value: T) => R): R {
            return onOk(value);
        }
    }
}

export function Err<T, E>(err: E): Result<T, E> {
    return {
        mapErr<R>(mapper: (e: E) => R): Result<T, R> {
            return Err(mapper(err));
        },
        mapValueToResult<R>(): Result<R, E> {
            return Err(err);
        },
        match<R>(_: (value: T) => R, onErr: (e: E) => R): R {
            return onErr(err);
        }
    }
}

export interface AsyncResult<T, E> {
    consumeSync(onOk: (value: T) => void, onErr: (e: E) => void): void;

    mapErr<R>(mapper: (e: E) => R): AsyncResult<T, R>;

    mapValueToResult<R>(mapper: (value: T) => Result<R, E>): AsyncResult<R, E>;
}

function AsyncResult<T, E>(promise: Promise<Result<T, E>>): AsyncResult<T, E> {
    return {
        mapErr<R>(mapper: (e: E) => R): AsyncResult<T, R> {
            return AsyncResult(promise.then(result => result.mapErr(mapper)));
        },
        mapValueToResult<R>(mapper: (value: T) => Result<R, E>): AsyncResult<R, E> {
            return AsyncResult(promise.then(result => result.mapValueToResult(mapper)));
        },
        consumeSync(onOk: (value: T) => void, onErr: (e: E) => void): void {
            promise.then(result => result.match(onOk, onErr))
        }
    }
}

export function $AsyncResult<T>(promise: () => Promise<T>): AsyncResult<T, unknown> {
    return AsyncResult(new Promise<Result<T, unknown>>(async resolve => {
        try {
            resolve(Ok(await promise()));
        } catch (e) {
            resolve(Err(e));
        }
    }));
}
