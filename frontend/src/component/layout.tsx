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
    interactive?: boolean;
    position?: "absolute" | "relative";
    left?: number;
    top?: number;
    compact?: boolean;
}

export const Stack = component$<StackProps>(props => {
    return (
        <div style={{
            position: props.position,
            width: props.compact ? undefined : "100%",
            height: props.compact? undefined : "100%",
            "pointer-events": props.interactive ? undefined : "none",
            top: props.top ? props.top + "px" : undefined,
            left: props.left ? props.left + "px" : undefined
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
            "background-color": props.color ?? "white",
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
