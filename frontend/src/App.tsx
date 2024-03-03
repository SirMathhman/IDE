import './App.css';
import {createSignal, For, onMount, Show} from "solid-js";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {$AsyncResult, AsyncResult, Err, exceptionally, parseString, streamFromArray, toArray} from "@ide/common";
import {Center, Column} from "./Flex.tsx";
import {Padding} from "./Padding.tsx";
import {Box, Sheet} from "./Container.tsx";
import {FontSize, Text} from "./Text.tsx";

function applyAxios(config: AxiosRequestConfig): AsyncResult<AxiosResponse, AxiosError> {
    return $AsyncResult<AxiosResponse>(() => {
        return axios(config);
    }).mapErr(e => {
        return e as AxiosError;
    });
}

export function APIErrorFromMessage(message: string): Error {
    return Error(message);
}

export function APIErrorFromCause(cause: Error): Error {
    return Error(cause.message);
}

function App() {
    const [path, _] = createSignal(".");
    const [files, setFiles] = createSignal<string[]>([]);

    const [errorText, setText] = createSignal<string | undefined>(undefined);

    onMount(async () => {
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
        }).consumeSync(
            files => {
                console.log(files);
                setFiles(files);
            },
            e => setText(e.message)
        );
    });

    return (
        <Center>
            <Box width="50%" height="50%" compact>
                <Sheet elevated rounded>
                    <Padding>
                        <Show when={errorText()}>
                     <span style={{
                         "font-family": "Arial",
                         "font-size": "2rem"
                     }}>
                         Failed to Read Files
                </span>
                            <span>
                        {errorText()}
                    </span>
                        </Show>
                        <Show when={!errorText()}>
                            <Text size={FontSize.Large}>
                                Open a Directory
                            </Text>
                            <Column>
                                <For each={files()}>{(file) => (
                                    <Text>
                                        {file}
                                    </Text>
                                )}</For>
                            </Column>
                        </Show>
                    </Padding>
                </Sheet>
            </Box>
        </Center>
    )
}

export default App
