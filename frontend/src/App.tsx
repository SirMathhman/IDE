import {createSignal, For, onMount} from 'solid-js'
import './App.css'
import axios from "axios";

function App() {
    const [files, setFiles] = createSignal<string[]>([]);
    const [currentFile, setCurrentFile] = createSignal<string | undefined>(undefined);
    const [currentFileContent, setCurrentFileContent] = createSignal<string[]>([]);

    onMount(async () => {
        let response = await axios({
            method: "get",
            url: "http://localhost:3000/file"
        });

        setFiles(response.data.sort());
    });

    function onFileChange(file: string) {
        return async function () {
            setCurrentFile(file);

            const response = await axios({
                method: "get",
                url: "http://localhost:3000/file/" + file
            });

            setCurrentFileContent(response.data.split("\n"));
        }
    }

    return (
        <div style={{
            display: "flex",
            "flex-direction": "row",
            gap: "1rem",
            padding: "1rem"
        }}>
            <div style={{
                width: "20%"
            }}>
                <div style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "0.5rem"
                }}>
                    <div style={{
                        padding: "1rem"
                    }}>
                    <span style={{
                        "font-size": "2rem"
                    }}>
                        Files
                    </span>
                    </div>
                    <div style={{
                        display: "flex",
                        "flex-direction": "column",
                        gap: "0.5rem"
                    }}>
                        <For each={files()}>{(file) => (
                            <button onClick={onFileChange(file)}>
                                {file}
                            </button>
                        )}</For>
                    </div>
                </div>
            </div>
            <div style={{
                width: "calc(80% - 1rem)"
            }}>
                <div style={{
                    padding: "1rem"
                }}>
                    <span style={{
                        "font-size": "2rem"
                    }}>
                      {currentFile()}
                    </span>
                </div>
                <div>
                    <For each={currentFileContent()}>{(line) => {
                        return <div style={{
                            "min-height": "1rem"
                        }}>{line}</div>
                    }}
                    </For>
                </div>
            </div>
        </div>
    )
}

export default App
