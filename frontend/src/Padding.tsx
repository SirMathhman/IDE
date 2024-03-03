import {JSX} from "solid-js";

export interface PaddingProps {
    amount?: string;
    children: JSX.Element;
}

export function Padding(props: PaddingProps) {
    const actualAmount = props.amount ?? "1rem";

    return (
        <div style={{
            padding: actualAmount,
            width: "calc(100% - (" + actualAmount + " * 2))",
            height: "calc(100% - (" + actualAmount + " * 2))"
        }}>
            {props.children}
        </div>
    )
}
