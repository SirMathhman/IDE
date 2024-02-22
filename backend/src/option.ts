export interface Option<T> {
    into<R>(mapper: (self: Option<T>) => R): R;

    map<R>(mapper: (child: T) => R): Option<R>;

    orElseGet(supplier: () => T): T;
}

export function Some<T>(value: T): Option<T> {
    return {
        map<R>(mapper: (child: T) => R): Option<R> {
            return Some(mapper(value));
        },
        orElseGet(): T {
            return value;
        },
        into<R>(mapper: (self: Option<T>) => R): R {
            return mapper(this);
        }
    }
}

export function None<T>(): Option<T> {
    return {
        map<R>(): Option<R> {
            return None();
        },
        orElseGet(supplier: () => T): T {
            return supplier();
        },
        into<R>(mapper: (self: Option<T>) => R): R {
            return mapper(this);
        }
    }
}
