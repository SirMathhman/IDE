import {AsyncResult, Result} from "./result";
import {Option} from "./option";

export interface PathError {
    message: string;
}

export function PathError(message: string): PathError {
    return {
        message
    }
}

export interface File {

}

export interface Path {
    lastName(): Option<string>;
}

export interface Directory {
    listPaths(): AsyncResult<Path[], PathError>;
}

export interface Paths {
    createEmptyPath(): Path;

    findCurrentWorkingDirectory(): AsyncResult<Directory, PathError>;
}
