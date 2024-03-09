import {$, component$, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./component/text.tsx";
import {Box, Padding} from "./component/contain.tsx";
import {Column, Row} from "./component/flex.tsx";
import {Header, HorizontalRule, Sheet, Stack} from "./component/layout.tsx";
import axios from "axios";
import {Navigation} from "./app/navigate.tsx";
import {Content} from "./app/content.tsx";

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

    const openFile = $(async (name: string) => {
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
    });

    return (
        <>
            <div>
                <Stack interactable>
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
                                    <Navigation files={files.value} openFile={openFile}/>
                                </Box>
                                <HorizontalRule/>
                                <Box width="80%" expanded overflow-y>
                                    <Content value={content.value}/>
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
