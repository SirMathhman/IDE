import {None, Option, Some} from "./option";
import {Ok, Result} from "./result";
import {ImmutableList, List} from "./js";

export interface Stream<T> {
    collect<C>(collector: Collector<T, C>): C;

    flatMap<R>(mapper: (element: T) => Stream<R>): Stream<R>;

    foldRight<C>(initial: C, folder: (previous: C, element: T) => C): C;

    map<R>(mapper: (element: T) => R): Stream<R>;

    next(): Option<T>;
}

export function AbstractStream<T>(generator: () => Option<T>): Stream<T> {
    return {
        next(): Option<T> {
            return generator();
        },
        flatMap<R>(mapper: (element: T) => Stream<R>): Stream<R> {
            const outer = this;
            return generator().map(mapper).map<Stream<R>>(stream => {
                let current = stream;
                return AbstractStream<R>((): Option<R> => {
                    while (true) {
                        const next = current.next();
                        if (next.isPresent) return next;

                        const [hasNextCurrent, nextCurrent] = outer.next()
                            .map(mapper)
                            .toTuple(current);

                        if (hasNextCurrent) {
                            current = nextCurrent;
                        } else {
                            return None();
                        }
                    }
                });
            }).orElse(empty());
        },
        map<R>(mapper: (element: T) => R): Stream<R> {
            return AbstractStream(() => generator().map(mapper));
        },
        collect<C>(collector: Collector<T, C>): C {
            return this.foldRight(collector.initial, collector.foldRight);
        },
        foldRight<C>(initial: C, folder: (previous: C, element: T) => C) {
            let current = initial;
            while (true) {
                const [shouldContinue, next] = generator()
                    .map(element =>
                        folder(current, element)
                    )
                    .toTuple(current);

                if (shouldContinue) {
                    current = next;
                } else {
                    return current;
                }
            }
        }
    }
}

export function streamFromArray<T>(array: T[]): Stream<T> {
    let counter = 0;
    return AbstractStream(() => {
        if (counter < array.length) {
            const element = array[counter];
            counter++;
            return Some(element);
        } else {
            return None();
        }
    });
}

export interface Collector<T, C> {
    initial: C;

    foldRight(previous: C, element: T): C;
}

export function requireAll<T, C>(collector: Collector<T, C>): Collector<Option<T>, Option<C>> {
    return {
        initial: Some(collector.initial),
        foldRight(previous: Option<C>, element: Option<T>): Option<C> {
            return previous.and(element)
                .map(([previousValue, elementValue]) => collector
                    .foldRight(previousValue, elementValue));
        }
    }
}

export function exceptionally<T, E, C>(collector: Collector<T, C>): Collector<Result<T, E>, Result<C, E>> {
    return {
        initial: Ok(collector.initial),
        foldRight(previous: Result<C, E>, element: Result<T, E>): Result<C, E> {
            return previous.and(element).mapValue(([previousValue, elementValue]) => {
                return collector.foldRight(previousValue, elementValue);
            });
        }
    }
}

export function toArray<T>(): Collector<T, T[]> {
    return {
        initial: [],
        foldRight(previous: T[], element: T): T[] {
            const copy = [...previous];
            copy.push(element);
            return copy;
        }
    }
}

export function toImmutableList<T>(): Collector<T, List<T>> {
    return {
        foldRight<T>(previous: List<T>, element: T): List<T> {
            return previous.add(element);
        }, initial: ImmutableList()
    }
}

function fromElements<T>(...values: T[]) : Stream<T> {
    let counter = 0;
    return AbstractStream(() => {
        if (counter < values.length) {
            const value = values[counter];
            counter++;
            return Some(value);
        } else {
            return None();
        }
    })
}

function empty<T>() {
    return AbstractStream(() => None<T>());
}

export function fromOption<T>(option: Option<T>) : Stream<T> {
    return option
        .map(innerValue => fromElements<T>(innerValue))
        .orElse(empty<T>());
}
