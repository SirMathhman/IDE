import {$, component$, QRL, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./component/text.tsx";
import {Box, Padding} from "./component/contain.tsx";
import {Column, Row} from "./component/flex.tsx";
import {Header, HorizontalRule, Sheet, Stack} from "./component/layout.tsx";
import axios from "axios";
import {Navigation} from "./app/navigate.tsx";
import {Content} from "./app/content.tsx";

export interface MainProps {
    onError: QRL<(error: unknown) => void>;
}

export const Main = component$<MainProps>(props => {
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
            await props.onError(e);
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

            content.value = data.split("\n");
        } catch (e) {
            console.error(e);
        }
    });

    return (
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
    )
});

const ErrorDisplay = component$<{ value: string }>(props => {
    return (
        <Stack>
            <Column justify="end" align="center">
                <Box>
                    <Padding>
                        <Sheet rounded color="crimson">
                            <Box width="50vw">
                                <Padding>
                                    <Row justify="center">
                                        <Text color="white">
                                            {props.value}
                                        </Text>
                                    </Row>
                                </Padding>
                            </Box>
                        </Sheet>
                    </Padding>
                </Box>
            </Column>
        </Stack>
    )
});

export const App = component$(() => {
    const errorText = useSignal<string | undefined>(undefined);

    const setError = $((value: unknown) => {
        let message: string;
        if (value instanceof Error) {
            message = value.message;
        } else if (typeof value === "string") {
            message = value;
        } else {
            message = JSON.stringify(value);
        }

        errorText.value = message;
    });

    return (
        <>
            <div>
                <Stack interactable>
                    <Main onError={setError}/>
                </Stack>
                {errorText.value && <ErrorDisplay value={errorText.value}/>}
            </div>
        </>
    )
})
