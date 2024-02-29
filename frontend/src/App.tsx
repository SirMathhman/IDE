import './App.css';

function App() {
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
                <span style={{
                    "font-family": "Arial",
                    "font-size": "2rem"
                }}>
                    Open a Directory
                </span>
            </div>
        </div>
    )
}

export default App
