import {
    $AsyncResultUnknown,
    AsyncResult,
    CastError,
    Directory,
    Error,
    ListPath,
    ListType,
    Path,
    StringType,
    ThrowableOption,
    toImmutableList,
    Type
} from "@ide/common";
import axios from "axios";
import {ImmutableList, JSUnknown, List} from "@ide/common/src/js.ts";

interface SafeConfig {
    data?: JSUnknown,
    method: string,
    url: string
}

function safeAxios(safeConfig: SafeConfig) {
    return $AsyncResultUnknown(() => {
        const data = safeConfig.data;
        return axios({
            method: safeConfig.method,
            url: safeConfig.url,
            data: data?.unwrap()
        });
    });
}

function safeAxiosCasted<T>(config: SafeConfig, type: Type<T>) {
    return safeAxios(config)
        .mapValue(response => response.data)
        .mapValue(data => JSUnknown(data))
        .mapValueToResult(value => type.deserialize(value)
            .into(ThrowableOption)
            .orElseErr(() => new CastError(value.unwrap(), type.asString())));
}

export function AxiosPaths(url: string) {
    function AxiosDirectory(location: Path): Directory {
        return {
            listPaths(): AsyncResult<List<Path>, Error> {
                const config: SafeConfig = {
                    method: "get",
                    url: url + "/directory/listPaths",
                    data: location.serialize()
                };

                return safeAxiosCasted(config, ListType(ListType(StringType)))
                    .mapValue(value => {
                        return value.stream().map(ListPath).collect(toImmutableList());
                    });
            }
        }
    }

    return {
        createEmptyPath(): Path {
            return ListPath(ImmutableList());
        },
        findCurrentWorkingDirectory(): AsyncResult<Directory, Error> {
            const config = {
                method: "get",
                url: url + "/findCurrentWorkingDirectory"
            };

            return safeAxiosCasted(config, ListType(StringType))
                .mapValue(ListPath)
                .mapValue(AxiosDirectory);
        }
    }
}
