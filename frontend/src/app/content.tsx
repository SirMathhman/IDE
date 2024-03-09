import {component$} from "@builder.io/qwik";
import {Column, Row} from "../component/flex.tsx";
import {Header, HorizontalRule} from "../component/layout.tsx";
import {Box, Padding} from "../component/contain.tsx";
import {Text} from "../component/text.tsx";

export interface ContentProps {
    value: string[];
}

export const Content = component$<ContentProps>(props => {
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
        <Column>
            <Header>
                Content
            </Header>
            <HorizontalRule/>
            <Padding>
                {
                    props.value.map((line, index) => {
                        return (
                            <Box key={index}>
                                <Row>
                                    <Text family="Consolas">
                                        {formatIndex(index, props.value.length)}
                                    </Text>
                                    <Text family="Consolas">
                                        {line}
                                    </Text>
                                </Row>
                            </Box>
                        )
                    })
                }
            </Padding>
        </Column>
    )
});
