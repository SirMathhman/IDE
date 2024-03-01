import {JSUnknown} from "./js";
import {Option} from "@ide/common";

interface Result<T, E> {
    $(): T;

    mapErr<R>(mapper: (error: E) => R): Result<T, R>;

    mapValue<R>(mapper: (error: T) => R): Result<R, E>;

    match<R>(onOk: (value: T) => R, onErr: (error: E) => R): R;
}

function Ok<T, E>(value: T): Result<T, E> {
    return {
        $() {
            return value;
        },
        mapValue<R>(mapper: (error: T) => R): Result<R, E> {
            return Ok(mapper(value));
        },
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
        $() {
            throw err;
        },
        mapValue<R>(): Result<R, E> {
            return Err(err);
        },
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

    async $(): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const result = await this.parent;
            try {
                resolve(result.$());
            } catch (e) {
                reject(e);
            }
        });
    }

    mapErr<R>(mapper: (error: E) => R) {
        return new AsyncResult(this.parent.then(value => {
            return value.mapErr(mapper);
        }));
    }

    mapValue<R>(mapper: (error: T) => R) {
        return new AsyncResult(this.parent.then(value => {
            return value.mapValue(mapper);
        }));
    }

    async match<R>(onOk: (value: T) => R, onErr: (error: E) => R): Promise<R> {
        return this.parent.then(inner => {
            return inner.match(onOk, onErr);
        });
    }
}

export function $AsyncResultToType<T, E>(action: () => Promise<T>): AsyncResult<T, E> {
    return new AsyncResult(new Promise<Result<T, E>>(async (resolve) => {
        try {
            resolve(Ok(await action()));
        } catch (e) {
            resolve(Err(e as E));
        }
    }));
}

export function $AsyncResultUnknown<T>(action: () => Promise<T>): AsyncResult<T, JSUnknown> {
    return new AsyncResult(new Promise<Result<T, JSUnknown>>(async (resolve) => {
        try {
            resolve(Ok(await action()));
        } catch (e) {
            resolve(Err(JSUnknown(e)));
        }
    }));
}

export interface ThrowableOption<T> extends Option<T> {
    orElseErr<E>(supplier: () => E): Result<T, E>;
}

export function ThrowableOption<T>(option: Option<T>): ThrowableOption<T> {
    return {
        ...option,
        orElseErr<E>(supplier: () => E): Result<T, E> {
            return option
                .map(value => Ok<T, E>(value))
                .orElseGet(() => Err<T, E>(supplier()));
        }
    }
}
