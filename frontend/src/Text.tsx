import {JSX} from "solid-js";

export enum FontSize {
    Small = "0.75rem",
    Normal = "1rem",
    Large = "2rem",
}

export interface TextProps {
    color?: string;
    children: JSX.Element;
    size?: FontSize;
}

export function Text({color, children, size}: TextProps) {
    return (
        <span style={{
            color,
            "font-family": "Arial",
            "font-size": size ?? FontSize.Normal
        }}>
            {children}
        </span>
    )
}
