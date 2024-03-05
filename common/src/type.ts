import {ImmutableList, JSUnknown, List} from "./js";
import {None, Option, Some} from "./option";
import {requireAll, toArray, toImmutableList} from "./stream";

export interface Type<T> {
    asString(): string;

    deserialize(value: JSUnknown): Option<T>;

    serialize(value: T): JSUnknown;
}

export const StringType: Type<string> = {
    asString(): string {
        return "string";
    },
    serialize(value: string): JSUnknown {
        return JSUnknown(value);
    },
    deserialize(value: JSUnknown): Option<string> {
        const unwrapped = value.unwrap();
        return typeof unwrapped === "string"
            ? Some(unwrapped as string)
            : None();
    }
}

export function ListType<T>(parent: Type<T>): Type<List<T>> {
    return {
        asString(): string {
            return "List[" + parent.asString() + "]";
        },
        serialize(value: List<T>): JSUnknown {
            const serializedArray = value.stream()
                .map(parent.serialize.bind(parent))
                .map(value => value.unwrap())
                .collect(toArray());

            return JSUnknown(serializedArray);
        },
        deserialize(array: JSUnknown): Option<List<T>> {
            const values = array.unwrap();
            if (!Array.isArray(values)) return None();
            return ImmutableList(values)
                .stream()
                .map(JSUnknown)
                .map(parent.deserialize.bind(parent))
                .collect(requireAll(toImmutableList()))
        }
    }
}
