import {component$, Slot} from "@builder.io/qwik";

interface TextProps {
    family?: string;
}

export const Text = component$<TextProps>(({family}) => {
    return (
        <p style={{
            margin: 0,
            padding: 0,
            "white-space": "nowrap"
        }}>
            <span style={{
                "font-family": family ?? "Arial"
            }}>
                <Slot/>
            </span>
        </p>
    )
});
