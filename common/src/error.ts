export interface Error {
    cause?: Error;
    message: string;
}

export function Error(message: string, cause: Error | undefined = undefined): Error {
    return {
        message,
        cause
    }
}
