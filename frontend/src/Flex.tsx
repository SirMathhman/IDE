import {JSX} from "solid-js";

export interface FlexProps {
    children: JSX.Element;
    direction: "row" | "column",
    gap?: boolean | string;
}

export function Flex({direction, children, gap}: FlexProps) {
    let actualGap: string;
    if (typeof gap === "string") {
        actualGap = gap;
    } else {
        if (typeof gap === "boolean" && gap) {
            actualGap = "1rem";
        } else {
            actualGap = "";
        }
    }

    return (
        <div style={{
            display: "flex",
            "flex-direction": direction,
            gap: actualGap,
            width: "100%",
            height: "100%"
        }}>
            {children}
        </div>
    )
}

export function Column(props: Omit<FlexProps, "direction">) {
    return (
        <Flex {...props} direction="column">
            {props.children}
        </Flex>
    )
}

export function Row(props: Omit<FlexProps, "direction">) {
    return (
        <Flex {...props} direction="row">
            {props.children}
        </Flex>
    )
}
