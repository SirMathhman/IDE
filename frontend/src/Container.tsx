import {JSX} from "solid-js";

export interface BoxProps {
    children: JSX.Element;
    compact?: boolean
    height?: string;
    width?: string;
}

export function Box({width, height, children, compact}: BoxProps) {
    return (
        <div style={{
            width: width ?? (compact ? undefined : "100%"),
            height: height ?? (compact ? undefined : "100%")
        }}>
            {children}
        </div>
    )
}

export interface SheetProps {
    children: JSX.Element;
    elevated?: number | boolean;
    rounded?: boolean;
}

export function Sheet({children, elevated, rounded}: SheetProps) {
    let elevationValue : number | undefined;
    if (typeof elevated === "number") {
        elevationValue = elevated;
    } else if (elevated) {
        elevationValue = 1;
    } else {
        elevationValue = undefined;
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            "box-shadow": `0 0 calc(5px * ${elevationValue}) 0px`,
            "border-radius": rounded ? "1rem" : undefined
        }}>
            {children}
        </div>
    )
}
