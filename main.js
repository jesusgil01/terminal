const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os");
const pty = require("node-pty");

let appWin;
let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

createWindow = () => {
    appWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Angular and Electron",
        resizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.setMenu(null);

    appWin.on("closed", () => {
        appWin = null;
    });

    let ptyProcess = pty.spawn(shell);

    ptyProcess.on("data", function(data) {
        appWin.webContents.send("terminal.incData", data);
    });

    ipcMain.on("terminal.toTerm", function(event,data) {
        ptyProcess.write(data)
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});