import {JSX} from "solid-js";

export interface FlexProps {
    align?: string;
    children: JSX.Element;
    direction: "row" | "column",
    gap?: boolean | string;
    justify?: string;
}

export function Flex({direction, children, gap, justify, align}: FlexProps) {
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
            height: "100%",
            "justify-content": justify,
            "align-items": align
        }}>
            {children}
        </div>
    )
}

export interface CenterProps {
    children: JSX.Element;
}

export function Center(props: CenterProps) {
    return (
        <Flex direction="row" justify="center" align="center">
            {props.children}
        </Flex>
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
