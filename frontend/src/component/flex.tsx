import {component$, Slot} from "@builder.io/qwik";

export interface FlexProps {
    align?: string;
    direction: "row" | "column";
    justify?: string;
}

export const Flex = component$<FlexProps>((props) => {
    return (
        <div style={{
            display: "flex",
            "flex-direction": props.direction,
            width: "100%",
            height: "100%",
            "justify-content": props.justify,
            "align-items": props.align
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

export const Compact = component$(() => {
    return (
        <div style={{
            flex: "0 1 auto"
        }}>
            <Slot/>
        </div>
    )
});

export const Expand = component$(() => {
    return (
        <div style={{
            flex: "1 1 auto"
        }}>
            <Slot/>
        </div>
    );
});
