import {component$, Slot} from "@builder.io/qwik";
import {Box, Padding} from "./contain.tsx";
import {Text} from "./text.tsx";

export const HorizontalRule = component$(() => {
    return (<hr style={{
        padding: 0,
        margin: 0
    }}/>)
});

export interface StackProps {
    interactable?: boolean;
}

export const Stack = component$<StackProps>(props => {
    return (
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            "pointer-events": props.interactable ? undefined : "none"
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
export const Header = component$(() => {
    return (
        <Box>
            <Padding>
                <Text>
                    <Slot/>
                </Text>
            </Padding>
        </Box>
    )
});
