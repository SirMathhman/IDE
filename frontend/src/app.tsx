import {component$, useSignal, useTask$} from '@builder.io/qwik';
import {Text} from "./text.tsx";
import {Constraint, Padding} from "./contain.tsx";
import {Column, Row} from "./flex.tsx";
import {HorizontalRule} from "./layout.tsx";
import axios from "axios";

export const App = component$(() => {
    const signal = useSignal<string[]>([]);

    useTask$(async () => {
        try {
            const response = await axios({
                method: "get",
                url: "http://localhost:3000/list"
            });

            signal.value = response.data;
        } catch (e) {
        }
    });

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
                                signal.value.map((element, index) => {
                                    return (
                                        <Text key={index}>
                                            {element}
                                        </Text>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Text>
                    </Padding>
                </Constraint>
            </Row>
        </Column>
    )
})
