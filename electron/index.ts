import {app, BrowserWindow} from 'electron';

import {spawn} from "child_process";
import * as child_process from "child_process";

let mainWindow: BrowserWindow | undefined;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // Load your frontend here
    // In development, load Vite dev server, otherwise load your production build
    const startURL = 'http://localhost:5173';
    await mainWindow.loadURL(startURL);

    mainWindow.on('closed', function () {
        mainWindow = undefined;
    });
}


let frontend: child_process.ChildProcessWithoutNullStreams | undefined;

// Start your backend server
function startFrontend() {
    backend = spawn('npm', ['run', 'dev'], {
        cwd: 'frontend',  // Set the working directory to '/backend'
        shell: true     // Use shell to interpret the command
    });

    backend.stdout.on('data', (data: any) => {
        console.log(`Backend: ${data}`);
    });

    backend.stderr.on('data', (data: any) => {
        console.error(`Backend Error: ${data}`);
    });
}


let backend: child_process.ChildProcessWithoutNullStreams | undefined;

// Start your backend server
function startBackend() {
    backend = spawn('npm', ['run', 'dev'], {
        cwd: 'backend',  // Set the working directory to '/backend'
        shell: true     // Use shell to interpret the command
    });

    backend.stdout.on('data', (data: any) => {
        console.log(`Backend: ${data}`);
    });

    backend.stderr.on('data', (data: any) => {
        console.error(`Backend Error: ${data}`);
    });
}

app.on('ready', async () => {
    startFrontend();
    startBackend();
    await createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
    if(backend) {
        backend.kill();
    }
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
