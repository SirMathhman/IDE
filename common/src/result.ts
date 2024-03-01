import {None, Option, Some} from "./option";
import {JSUnknown} from "./js";

export interface Result<T, E> {
    $: T;

    value: Option<T>;

    and<R>(other: Result<R, E>): Result<[T, R], E>;

    mapErr<R>(mapper: (e: E) => R): Result<T, R>;

    mapValue<R>(mapper: (value: T) => R): Result<R, E>;

    mapValueToResult<R>(mapper: (value: T) => Result<R, E>): Result<R, E>;

    match<R>(onOk: (value: T) => R, onErr: (e: E) => R): R;
}

export function Ok<T, E>(value: T): Result<T, E> {
    return {
        $: value,
        value: Some(value),
        mapValue<R>(mapper: (value: T) => R): Result<R, E> {
            return Ok(mapper(value));
        },
        and<R>(other: Result<R, E>): Result<[T, R], E> {
            return other.mapValue(otherValue => [value, otherValue]);
        },
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
        get $(): T {
            throw err;
        },
        value: None(),
        and<R>(): Result<[T, R], E> {
            return Err(err);
        },
        mapValue<R>(): Result<R, E> {
            return Err(err);
        },
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
    $: Promise<T>;

    consumeSync(onOk: (value: T) => void, onErr: (e: E) => void): void;

    mapErr<R>(mapper: (e: E) => R): AsyncResult<T, R>;

    mapValue<R>(mapper: (e: T) => R): AsyncResult<R, E>;

    mapValueToResult<R>(mapper: (value: T) => Result<R, E>): AsyncResult<R, E>;

    match<R>(onOk: (value: T) => R, onErr: (error: E) => R): Promise<R>;
}

function AsyncResult<T, E>(parent: Promise<Result<T, E>>): AsyncResult<T, E> {
    return {
        mapErr<R>(mapper: (e: E) => R): AsyncResult<T, R> {
            return AsyncResult(parent.then(result => result.mapErr(mapper)));
        },
        mapValueToResult<R>(mapper: (value: T) => Result<R, E>): AsyncResult<R, E> {
            return AsyncResult(parent.then(result => result.mapValueToResult(mapper)));
        },
        consumeSync(onOk: (value: T) => void, onErr: (e: E) => void): void {
            parent.then(
                result => result.match(onOk, onErr)
            )
        },
        $: new Promise<T>(async (resolve, reject) => {
            const result = await parent;
            try {
                resolve(result.$);
            } catch (e) {
                reject(e);
            }
        }),
        mapValue<R>(mapper: (error: T) => R): AsyncResult<R, E> {
            return AsyncResult(parent.then(value => {
                return value.mapValue(mapper);
            }));
        },
        async match<R>(onOk: (value: T) => R, onErr: (error: E) => R): Promise<R> {
            return parent.then(inner => {
                return inner.match(onOk, onErr);
            });
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

export function $AsyncResultToType<T, E>(action: () => Promise<T>): AsyncResult<T, E> {
    return AsyncResult(new Promise<Result<T, E>>(async (resolve) => {
        try {
            resolve(Ok(await action()));
        } catch (e) {
            resolve(Err(e as E));
        }
    }));
}

export function $AsyncResultUnknown<T>(action: () => Promise<T>): AsyncResult<T, JSUnknown> {
    return $AsyncResult(action).mapErr(JSUnknown);
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
