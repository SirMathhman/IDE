import {$, component$, Slot, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./component/text.tsx";
import {Box, Padding} from "./component/contain.tsx";
import {Column, Compact, Expand, Row} from "./component/flex.tsx";
import {HorizontalRule, Sheet, Stack} from "./component/layout.tsx";
import axios from "axios";

export const Header = component$(() => {
    return (
        <Padding>
            <Text>
                <Slot/>
            </Text>
        </Padding>
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
                            <Header>
                                File
                            </Header>
                        </Box>
                        <HorizontalRule/>
                        <Box expanded height="96%">
                            <Row>
                                <Box width="20%" expanded>
                                    <Column>
                                        <Compact>
                                            <Header>
                                                Navigation
                                            </Header>
                                        </Compact>
                                        <HorizontalRule/>
                                        <Expand>
                                            <Padding>
                                                <Column>
                                                    {
                                                        files.value.map((element, index) => (
                                                            <button onClick$={openFile(element)} key={index}>
                                                                <Text>
                                                                    {element}
                                                                </Text>
                                                            </button>
                                                        ))
                                                    }
                                                </Column>
                                            </Padding>
                                        </Expand>
                                    </Column>
                                </Box>
                                <HorizontalRule/>
                                <Box width="80%" expanded overflow-y>
                                    <Header>
                                        Content
                                    </Header>
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
