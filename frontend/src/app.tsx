import {component$, Slot} from '@builder.io/qwik';

interface TextProps {
}

export const Text = component$<TextProps>(() => {
    return (
        <span style={{
            "font-family": "Arial"
        }}>
            <Slot/>
        </span>
    )
});

interface PaddingProps {
}

export const Padding = component$<PaddingProps>(() => {
    return (
        <div style={{
            padding: "0.5rem"
        }}>
            <Slot/>
        </div>
    )
});

export interface FlexProps {
    direction: "row" | "column";
}

export const Flex = component$<FlexProps>(({direction}) => {
    return (
        <div style={{
            display: "flex",
            "flex-direction": direction,
            width: "100%",
            height: "100%"
        }}>
            <Slot/>
        </div>
    )
});

export const Row = component$<Omit<FlexProps, "direction">>(props => {
    return <Flex {...props} direction="row"><Slot/></Flex>
});

export const Column = component$<Omit<FlexProps, "direction">>(props => {
    return <Flex {...props} direction="column"><Slot/></Flex>
});

export const HorizontalRule = component$(() => {
    return (<hr style={{
        padding: 0,
        margin: 0
    }}/>)
});

export interface ConstraintProps {
    expanded?: boolean;
    height?: string;
    width?: string;
}

export const Constraint = component$<ConstraintProps>(({width, height, expanded}) => {
    return (
        <div style={{
            width: width ?? (expanded ? "100%" : undefined),
            height: height ?? (expanded ? "100%" : undefined)
        }}>
            <Slot/>
        </div>
    );
});

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
