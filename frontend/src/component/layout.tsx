import {component$, Slot} from "@builder.io/qwik";

export const HorizontalRule = component$(() => {
    return (<hr style={{
        padding: 0,
        margin: 0
    }}/>)
});
export const Stack = component$(() => {
    return (
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%"
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
