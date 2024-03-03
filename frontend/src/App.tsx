import './App.css';
import {createSignal, For, onMount, Show} from "solid-js";
import {Directory, None, Option, Path} from "@ide/common";
import {Center, Column, Row} from "./Flex.tsx";
import {Padding} from "./Padding.tsx";
import {Box, Sheet} from "./Container.tsx";
import {FontSize, Text} from "./Text.tsx";
import {Icon, IconValue} from "./Icon.tsx";
import {AxiosPaths} from "./path.ts";

function App() {
    const [path, _] = createSignal<Option<Directory>>(None());

    const [files, setFiles] = createSignal<string[]>([]);

    const [errorText, setText] = createSignal<string | undefined>(undefined);

    function filterFiles(paths: Path[]) {
        return paths
            .map(path => path.lastName())
            .flatMap(option => option.map(value => [value]).orElse([]));
    }

    onMount(() => {
        AxiosPaths.findCurrentWorkingDirectory()
            .mapValueToAsyncResult(directory => directory.listPaths())
            .mapValue(paths => filterFiles(paths))
            .consumeSync(
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
                            <Column gap="0.25rem">
                                <Text color="red" size={FontSize.Large}>
                                    Failed to Read Files
                                </Text>
                                <Text color="red">
                                    {errorText()}
                                </Text>
                            </Column>
                        </Show>
                        <Show when={!errorText()}>
                            <Column gap="0.25rem">
                                <Text size={FontSize.Large}>
                                    Open a Directory
                                </Text>
                                <Box compact>
                                    <Row gap="0.5rem" align="center">
                                        <Sheet border="1px solid black" rounded="0.25rem">
                                            <Padding amount="0.25rem">
                                                <Column>
                                                    <Text size={FontSize.Small}>
                                                        Path
                                                    </Text>
                                                    <input style={{
                                                        border: "none",
                                                        "font-size": FontSize.Normal
                                                    }}/>
                                                </Column>
                                            </Padding>
                                        </Sheet>
                                        <Box compact>
                                            <button>
                                                <Icon value={IconValue.UpArrow}/>
                                            </button>
                                        </Box>
                                    </Row>
                                </Box>
                                <hr style={{
                                    width: "100%"
                                }}/>
                                <Column gap="0.5rem">
                                    <For each={files()}>{(file) => (
                                        <button>
                                            <Text>
                                                {file}
                                            </Text>
                                        </button>
                                    )}</For>
                                </Column>
                            </Column>
                        </Show>
                    </Padding>
                </Sheet>
            </Box>
        </Center>
    )
}

export default App
