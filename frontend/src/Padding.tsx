import {JSX} from "solid-js";

export interface PaddingProps {
    children: JSX.Element;
}

export function Padding(props: PaddingProps) {
    return (
        <div style={{
            padding: "1rem",
            width: "calc(100% - 2rem)",
            height: "calc(100% - 2rem)"
        }}>
            {props.children}
        </div>
    )
}
