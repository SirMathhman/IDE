import {$, component$, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./text.tsx";
import {Constraint, Padding} from "./contain.tsx";
import {Column, Row} from "./flex.tsx";
import {HorizontalRule} from "./layout.tsx";
import axios from "axios";

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

                content.value = (response.data as string).split("\n");
                console.log(content.value);
            } catch (e) {
                console.error(e);
            }
        })
    }

    return (
        <Column>
            <Constraint expanded height="4%">
                <Padding>
                    <Text>
                        File
                    </Text>
                </Padding>
            </Constraint>
            <HorizontalRule/>
            <Constraint expanded height="96%">
                <Row>
                    <Constraint width="20%" expanded>
                        <Padding>
                            <Text>
                                Navigation
                            </Text>
                        </Padding>
                        <HorizontalRule/>
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
                    </Constraint>
                    <HorizontalRule/>
                    <Constraint width="80%" expanded overflow-y>
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
                                        <Text family="Consolas" key={index}>
                                            {line}
                                        </Text>
                                    )
                                })
                            }
                        </Padding>
                    </Constraint>
                </Row>
            </Constraint>
        </Column>
    )
})
