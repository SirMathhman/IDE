import {component$, Signal, Slot} from "@builder.io/qwik";

interface PaddingProps {
}

export const Padding = component$<PaddingProps>(() => {
    return (
        <div style={{
            padding: "0.5rem",
            width: "calc(100% - 1rem)",
            height: "calc(100% - 1rem)"
        }}>
            <Slot/>
        </div>
    )
});

export interface BoxProps {
    expanded?: boolean;
    height?: string;
    "overflow-y"?: boolean;
    ref?: Signal<HTMLDivElement | undefined>;
    width?: string;
}

export const Box = component$<BoxProps>(
    (props) => {
        return (
            <div style={{
                width: props.width ?? (props.expanded ? "100%" : undefined),
                height: props.height ?? (props.expanded ? "100%" : undefined),
                "overflow-y": props["overflow-y"] ? "scroll" : undefined,
            }} ref={props.ref}>
                <Slot/>
            </div>
        );
    });
