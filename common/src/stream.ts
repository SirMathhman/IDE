import {None, Option, Some} from "./option";
import {Ok, Result} from "./result";

export interface Stream<T> {
    collect<C>(collector: Collector<T, C>): C;

    foldRight<C>(initial: C, folder: (previous: C, element: T) => C): C;

    map<R>(mapper: (element: T) => R): Stream<R>;
}

export function AbstractStream<T>(generator: () => Option<T>): Stream<T> {
    return {
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
