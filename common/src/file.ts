import {Result} from "./result";

export interface Path {

}

export interface File {

}

export interface Directory {

}

export interface PathError {
}

export function PathError(): PathError {
    return {}
}

export interface Paths {
    findCurrentWorkingDirectory(): Result<Directory, PathError>;
}
