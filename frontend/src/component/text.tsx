import {component$, Slot} from "@builder.io/qwik";

interface TextProps {
    color?: string;
    family?: string;
}

export const Text = component$<TextProps>((props) => {
    return (
        <p style={{
            margin: 0,
            padding: 0,
            "white-space": "pre"
        }}>
            <span style={{
                "color": props.color,
                "font-family": props.family ?? "Arial"
            }}>
                <Slot/>
            </span>
        </p>
    )
});
