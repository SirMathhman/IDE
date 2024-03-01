import {None, Option, Some} from "@ide/common";

export interface Map<K, V> {
    get(key: K): Option<V>;
}

type RecordKeyTypeConstraint = string | number | symbol;

export function jsMapFromRecord<K extends RecordKeyTypeConstraint, V>(record: Record<K, V>): Map<K, V> {
    return {
        get(key: K): Option<V> {
            const value = record[key];
            if (value) {
                return Some(value);
            } else {
                return None();
            }
        }
    }
}
