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
