import {component$, Slot} from "@builder.io/qwik";

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
