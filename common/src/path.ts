import {AsyncResult} from "./result";
import {Option} from "./option";
import {JSUnknown, List} from "./js";
import * as Path from "path";
import {Error} from "./error";

export interface Path {
    lastName(): Option<string>;

    resolveChild(child: string): Path;

    serialize(): JSUnknown;
}

export interface Directory {
    listPaths(): AsyncResult<List<Path>, Error>;
}

export interface Paths {
    createEmptyPath(): Path;

    findCurrentWorkingDirectory(): AsyncResult<Directory, Error>;
}

export function ListPath(location: List<string>): Path {
    return {
        lastName(): Option<string> {
            return location.last();
        },

        resolveChild(child: string): Path {
            return ListPath(location.add(child));
        },

        serialize(): JSUnknown {
            return JSUnknown(location.unwrap());
        }
    }
}
