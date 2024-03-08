import {component$, Slot} from "@builder.io/qwik";

interface TextProps {
    family?: string;
}

export const Text = component$<TextProps>(({family}) => {
    return (
        <p style={{
            margin: 0,
            padding: 0
        }}>
            <span style={{
                "font-family": family ?? "Arial"
            }}>
                <Slot/>
            </span>
        </p>
    )
});
