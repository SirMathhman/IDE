export interface Option<T> {
    map<R>(mapper: (element: T) => R): Option<R>;

    toTuple(other: T): [boolean, T];

    unwrap: T | undefined;
}

export function Some<T>(value: T): Option<T> {
    return {
        unwrap: value,
        map<R>(mapper: (element: T) => R): Option<R> {
            return Some(mapper(value));
        },
        toTuple(): [boolean, T] {
            return [true, value];
        }
    }
}

export function None<T>(): Option<T> {
    return {
        unwrap: undefined,
        map<R>(): Option<R> {
            return None();
        },
        toTuple(other: T): [boolean, T] {
            return [false, other];
        }
    }
}
