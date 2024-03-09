import {component$, QRL} from "@builder.io/qwik";
import {Column, Compact, Expand} from "../component/flex.tsx";
import {Header, HorizontalRule} from "../component/layout.tsx";
import {Padding} from "../component/contain.tsx";
import {Text} from "../component/text.tsx";

export interface Navigation {
    files: string[];
    openFile: QRL<(name: string) => void>;
}

export const Navigation = component$<Navigation>(props => {
    return (
        <Column>
            <Compact>
                <Header>
                    Navigation
                </Header>
            </Compact>
            <HorizontalRule/>
            <Expand>
                <Padding>
                    <Column>
                        {
                            props.files.map((element, index) => (
                                <button onClick$={() => props.openFile(element)} key={index}>
                                    <Text>
                                        {element}
                                    </Text>
                                </button>
                            ))
                        }
                    </Column>
                </Padding>
            </Expand>
        </Column>
    )
});
