interface Once<T> {
    value: T;

    use(action: () => Promise<void>): Promise<void>;
}

export function Once<T>(value: T, close: (value: T) => void): Once<T> {
    return {
        value,
        async use(action: (value: T) => Promise<void>) {
            await action(value);
            close(value);
        }
    }
}
