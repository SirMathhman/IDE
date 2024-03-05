import './App.css';
import {createMemo, createSignal, For, onMount, Show} from "solid-js";
import {Directory, Error, fromOption, None, Option, Path, Some, toImmutableList} from "@ide/common";
import {Center, Column, Row} from "./Flex.tsx";
import {Padding} from "./Padding.tsx";
import {Box, Sheet} from "./Container.tsx";
import {FontSize, Text} from "./Text.tsx";
import {Icon, IconValue} from "./Icon.tsx";
import {AxiosPaths} from "./path.ts";
import {ImmutableList, List} from "@ide/common/src/js.ts";

function App() {
    const [currentDirectory, setCurrentDirectory] = createSignal<Option<Directory>>(None());
    const [files, setFiles] = createSignal<List<string>>(ImmutableList());
    const [errorText, setText] = createSignal<string | undefined>(undefined);

    function filterFiles(paths: List<Path>) {
        return paths
            .stream()
            .map(path => path.lastName())
            .flatMap(value => fromOption(value))
            .collect(toImmutableList());
    }

    function handleErr(err: Error) {
        return setText(err.message);
    }

    onMount(async () => {
        await AxiosPaths("https://localhost:3000")
            .findCurrentWorkingDirectory()
            .consume(handleErr, directory => setCurrentDirectory(Some(directory)));
    });

    createMemo(() => {
        currentDirectory().ifPresent(currentDirectoryValue => {
            currentDirectoryValue.listPaths()
                .mapValue(paths => filterFiles(paths))
                .consumeSync(handleErr, files => setFiles(files));
        });
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
                                    <For each={files().unwrap()}>{(file) => (
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
