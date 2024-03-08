import {component$, Slot} from "@builder.io/qwik";

interface TextProps {
}

export const Text = component$<TextProps>(() => {
    return (
        <span style={{
            "font-family": "Arial"
        }}>
            <Slot/>
        </span>
    )
});
