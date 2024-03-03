export enum IconValue {
    UpArrow = "&#x2191;"
}

import {Text} from "./Text.tsx";

export function Icon({value}: { value: IconValue }) {
    return (
        <Text>
            <span innerHTML={value}/>
        </Text>
    )
}
