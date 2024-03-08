import {component$, Slot} from "@builder.io/qwik";

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

export interface ConstraintProps {
    expanded?: boolean;
    height?: string;
    "overflow-y"?: boolean;
    width?: string;
}

export const Constraint = component$<ConstraintProps>(
    (props) => {
    return (
        <div style={{
            width: props.width ?? (props.expanded ? "100%" : undefined),
            height: props.height ?? (props.expanded ? "100%" : undefined),
            "overflow-y": props["overflow-y"] ? "scroll" : undefined
        }}>
            <Slot/>
        </div>
    );
});
