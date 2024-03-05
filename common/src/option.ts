export interface Option<T> {
    isPresent: boolean;

    unwrap: T | undefined;

    and<R>(other: Option<R>): Option<[T, R]>;

    ifPresent(consumer: (value: T) => void): void;

    into<R>(mapper: (self: Option<T>) => R): R;

    map<R>(mapper: (element: T) => R): Option<R>;

    orElse(other: T): T;

    orElseGet(supplier: () => T): T;

    toTuple(other: T): [boolean, T];
}

export function Some<T>(value: T): Option<T> {
    return {
        isPresent: true,
        and<R>(other: Option<R>): Option<[T, R]> {
            return other.map(otherValue => [value, otherValue]);
        },
        ifPresent(consumer: (value: T) => void) {
            consumer(value);
        },
        orElse(): T {
            return value
        },
        orElseGet(): T {
            return value;
        },
        into<R>(mapper: (self: Option<T>) => R): R {
            return mapper(this);
        },
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
        isPresent: false,
        and<R>(): Option<[T, R]> {
            return None();
        },
        ifPresent() {
        },
        orElse(other: T): T {
            return other;
        },
        orElseGet(supplier: () => T): T {
            return supplier();
        },
        into<R>(mapper: (self: Option<T>) => R): R {
            return mapper(this);
        },
        unwrap: undefined,
        map<R>(): Option<R> {
            return None();
        },
        toTuple(other: T): [boolean, T] {
            return [false, other];
        }
    }
}
