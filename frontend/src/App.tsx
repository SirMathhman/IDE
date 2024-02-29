import './App.css';
import {createSignal, For, onMount, Show} from "solid-js";
import axios from "axios";

function App() {
    const [files, setFiles] = createSignal([]);
    const [errorText, setText] = createSignal<string | undefined>(undefined);

    onMount(async () => {
        axios({
            method: "get",
            url: "http://localhost:3000/file"
        }).then(response => setFiles(response.data)).catch(e => {
            setText(JSON.stringify(e));
        });
    });

    return (
        <div style={{
            display: "flex",
            "flex-direction": "row",
            "justify-content": "center",
            "align-items": "center",
            width: "100%",
            height: "100%"
        }}>
            <div style={{
                width: "50%",
                height: "50%",
                "box-shadow": "0 0 10px 0px",
                "border-radius": "1rem",
                padding: "1rem"
            }}>
                <Show when={!errorText()}>
                     <span style={{
                         "font-family": "Arial",
                         "font-size": "2rem"
                     }}>
                    Open a Directory
                </span>
                    <For each={files()}>{(file) => {
                        return (
                            <>
                                {file}
                            </>
                        )
                    }}</For>
                </Show>
                <Show when={errorText()}>
                     <span style={{
                         "font-family": "Arial",
                         "font-size": "2rem"
                     }}>
                         Failed to Read Files
                </span>
                    <span>
                        {errorText()}
                    </span>
                </Show>
            </div>
        </div>
    )
}

export default App
