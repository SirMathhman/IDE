import {$, component$, Slot, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./text.tsx";
import {Box, Padding} from "./contain.tsx";
import {Column, Compact, Expand, Row} from "./flex.tsx";
import {HorizontalRule} from "./layout.tsx";
import axios from "axios";

export const Stack = component$(() => {
    return (
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%"
        }}>
            <Slot/>
        </div>
    )
});

export interface SheetProps {
    color?: string;
    rounded?: boolean;
}

export const Sheet = component$<SheetProps>(props => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            "background-color": props.color,
            "border-radius": props.rounded ? "1rem" : undefined
        }}>
            <Slot/>
        </div>
    )
});

export const App = component$(() => {
    const files = useSignal<string[]>([]);
    const content = useSignal<string[]>([]);

    useTask$(async () => {
        try {
            const response = await axios({
                method: "get",
                url: "http://localhost:3000/list"
            });

            files.value = response.data;
        } catch (e) {
            console.error(e);
        }
    });

    function openFile(name: string) {
        return $(async () => {
            try {
                const response = await axios({
                    method: "post",
                    url: "http://localhost:3000/file",
                    data: {
                        name
                    }
                });

                const responseData = response.data;
                const data = typeof responseData === "string"
                    ? responseData
                    : JSON.stringify(responseData, null, "  ");

                console.log(data);
                content.value = data.split("\n");
            } catch (e) {
                console.error(e);
            }
        })
    }

    function formatIndex(index: number, total: number): string {
        const totalDigits = Math.floor(Math.log10(total) + 1);
        const indexDigits = (index + 1) === 0 ? 1 : Math.floor(Math.log10(index + 1) + 1);
        const delta = totalDigits - indexDigits;

        if (Number.isInteger(delta)) {
            return " ".repeat(delta) + (index + 1) + " ";
        } else {
            throw new Error("Index: " + index + ", Total: " + total);
        }
    }

    return (
        <>
            <div>
                <Stack>
                    <Column>
                        <Box expanded height="4%">
                            <Padding>
                                <Text>
                                    File
                                </Text>
                            </Padding>
                        </Box>
                        <HorizontalRule/>
                        <Box expanded height="96%">
                            <Row>
                                <Box width="20%" expanded>
                                    <Column>
                                        <Compact>
                                            <Padding>
                                                <Text>
                                                    Navigation
                                                </Text>
                                            </Padding>
                                        </Compact>
                                        <HorizontalRule/>
                                        <Expand>
                                            <Padding>
                                                <Column>
                                                    {
                                                        files.value.map((element, index) => {
                                                            return (
                                                                <button onClick$={openFile(element)} key={index}>
                                                                    <Text>
                                                                        {element}
                                                                    </Text>
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </Column>
                                            </Padding>
                                        </Expand>
                                    </Column>
                                </Box>
                                <HorizontalRule/>
                                <Box width="80%" expanded overflow-y>
                                    <Padding>
                                        <Text>
                                            Content
                                        </Text>
                                    </Padding>
                                    <HorizontalRule/>
                                    <Padding>
                                        {
                                            content.value.map((line, index) => {
                                                return (
                                                    <Row key={index}>
                                                        <Text family="Consolas">
                                                            {formatIndex(index, content.value.length)}
                                                        </Text>
                                                        <Text family="Consolas">
                                                            {line}
                                                        </Text>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Padding>
                                </Box>
                            </Row>
                        </Box>
                    </Column>
                </Stack>
                <Stack>
                    <Column justify="end" align="center">
                        <Box>
                            <Padding>
                                <Sheet rounded color="crimson">
                                    <Box width="50vw">
                                        <Padding>
                                            <Text color="white">
                                                This a test error message.
                                            </Text>
                                        </Padding>
                                    </Box>
                                </Sheet>
                            </Padding>
                        </Box>
                    </Column>
                </Stack>
            </div>
        </>
    )
})
