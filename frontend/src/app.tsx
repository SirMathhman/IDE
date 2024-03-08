import {component$, Slot} from '@builder.io/qwik';

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

export const App = component$(() => {
    return (
        <div style={{
            display: "flex",
            "flex-direction": "column"
        }}>
            <Padding>
                <Text>
                    File
                </Text>
            </Padding>
            <hr style={{
                padding: 0,
                margin: 0
            }}/>
            <div style={{
                display: "flex",
                "flex-direction": "row"
            }}>
                <Padding>
                    <Text>
                        Navigation
                    </Text>
                </Padding>
            </div>
        </div>
    )
})
