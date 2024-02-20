import {createSignal, For, onMount} from 'solid-js'
import './App.css'
import axios from "axios";

function App() {
    const [files, setFiles] = createSignal<string[]>([]);

    onMount(async () => {
        let response = await axios({
            method: "get",
            url: "http://localhost:3000/list"
        });

        setFiles(response.data);
    });

    return (
        <>
            <ol>
                <For each={files()}>{(file) => (
                    <li>
                        {file}
                    </li>
                )}</For>
            </ol>
        </>
    )
}

export default App
