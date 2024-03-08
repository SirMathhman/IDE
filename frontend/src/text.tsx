import {component$, Slot} from "@builder.io/qwik";

interface TextProps {
    family?: string;
}

export const Text = component$<TextProps>(({family}) => {
    return (
        <span style={{
            "font-family": family ?? "Arial"
        }}>
            <Slot/>
        </span>
    )
});
