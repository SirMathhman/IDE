import {$, component$, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./text.tsx";
import {Constraint, Padding} from "./contain.tsx";
import {Column, Row} from "./flex.tsx";
import {HorizontalRule} from "./layout.tsx";
import axios from "axios";

export const App = component$(() => {
    const files = useSignal<string[]>([]);
    const content = useSignal<string>("");

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

                content.value = response.data as string;
            } catch (e) {
                console.error(e);
            }
        })
    }

    return (
        <Column>
            <Padding>
                <Text>
                    File
                </Text>
            </Padding>
            <HorizontalRule/>
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
                <Constraint width="80%" expanded>
                    <Padding>
                        <Text>
                            Content
                        </Text>
                    </Padding>
                    <HorizontalRule/>
                    <Padding>
                        <Text family="Consolas">
                            {content.value}
                        </Text>
                    </Padding>
                </Constraint>
            </Row>
        </Column>
    )
})
