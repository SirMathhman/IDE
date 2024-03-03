import {JSX} from "solid-js";

export enum FontSize {
    Small = "0.75rem",
    Normal = "1rem",
    Large = "2rem",
}

export interface TextProps {
    children: JSX.Element;
    size?: FontSize;
}

export function Text({children, size}: TextProps) {
    return (
        <span style={{
            "font-family": "Arial",
            "font-size": size ?? FontSize.Normal
        }}>
            {children}
        </span>
    )
}
