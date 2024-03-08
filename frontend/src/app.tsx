import {component$} from '@builder.io/qwik';
import {Text} from "./text.tsx";
import {Constraint, Padding} from "./contain.tsx";
import {Column, Row} from "./flex.tsx";
import {HorizontalRule} from "./layout.tsx";

export const App = component$(() => {
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
                </Constraint>
                <HorizontalRule/>
                <Constraint width="80%" expanded>
                    <Padding>
                        <Text>
                            Content
                        </Text>
                    </Padding>
                </Constraint>
            </Row>
        </Column>
    )
})
