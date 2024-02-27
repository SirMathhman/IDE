import {createSignal, For, onMount} from 'solid-js'
import './App.css'
import axios from "axios";
import {Row} from "./Flex.tsx";
import {Padding} from "./Padding.tsx";

const ROOT_URL = "http://localhost:3000";

function App() {
    const [files, setFiles] = createSignal<string[]>([]);
    const [currentFile, setCurrentFile] = createSignal<string | undefined>(undefined);
    const [currentFileContent, setCurrentFileContent] = createSignal<string[]>([]);

    onMount(async () => {
        let response = await axios({
            method: "get",
            url: ROOT_URL + "/file"
        });

        setFiles(response.data.sort());
    });

    function onFileChange(file: string) {
        return async function () {
            setCurrentFile(file);

            const response = await axios({
                method: "get",
                url: ROOT_URL + "/file/" + file
            });

            setCurrentFileContent(response.data.split("\n"));
        }
    }

    return (
        <Row gap>
            <Padding>
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
                <div>
                    <Padding>
                        <>
                          <span style={{
                              "font-size": "2rem"
                          }}>
                          {currentFile()}
                        </span>
                            <div>
                                <For each={currentFileContent()}>{(line) => {
                                    return <div style={{
                                        "min-height": "1rem"
                                    }}>{line}</div>
                                }}
                                </For>
                            </div>
                        </>
                    </Padding>
                </div>
            </Padding>
        </Row>
    )
}

export default App
