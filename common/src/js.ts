import {None, Option, Some} from "./option";
import {AbstractStream, Stream} from "./stream";

export interface JSUnknown {
    asJSON(): string;

    unwrap(): unknown;
}

export function JSUnknown(value: unknown): JSUnknown {
    return {
        asJSON() {
            return JSON.stringify(value);
        },
        unwrap() {
            return value;
        }
    }
}

export interface List<T> {
    add(element: T): List<T>;

    last(): Option<T>;

    stream(): Stream<T>;

    unwrap(): T[];
}

export function ImmutableList<T>(values: T[] = []): List<T> {
    return {
        unwrap(): T[] {
            return values;
        },
        stream(): Stream<T> {
            let counter = 0;
            return AbstractStream(() => {
                if (counter >= values.length) return None();
                const element = values[counter];
                counter++;
                return Some(element);
            });
        },
        add(element: T): List<T> {
            const copy = [...values];
            copy.push(element);
            return ImmutableList(copy);
        },
        last(): Option<T> {
            if (values.length === 0) return None();
            else return Some(values[values.length - 1]);
        }
    }
}
