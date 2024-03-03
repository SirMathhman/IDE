import {AsyncResult, Directory, Err, Path, PathError, Paths} from "@ide/common";

export const AxiosPaths: Paths = {
    createEmptyPath(): Path {
        return {}
    },
    findCurrentWorkingDirectory(): AsyncResult<Directory, PathError> {
        /*
                applyAxios({
            method: "get",
            url: "http://localhost:3000/file",
            params: {
                path: path()
            }
        }).mapErr(err => {
            return APIErrorFromMessage(err.message);
        }).mapValueToResult<string[]>(response => {
            const {data} = response;
            if (!Array.isArray(data)) return Err(APIErrorFromMessage("Not an array."));
            return streamFromArray(data)
                .map(entry => parseString(entry))
                .map(result => result.mapErr(APIErrorFromCause))
                .collect(exceptionally(toArray()));
        })
         */
        return AsyncResult(Promise.resolve(Err(PathError("Not implemented yet."))));
    }
}
