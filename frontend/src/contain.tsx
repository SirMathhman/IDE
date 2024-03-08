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
