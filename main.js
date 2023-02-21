
const { win, BrowserWindow, app, ipcMain, Notification } = require("electron");

const path = require("path")

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "white",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile("./public/index.html")
}

ipcMain.on("notify", (_, message) => {
    new Notification({title: "Notification", body: message}).show();
})

app.whenReady().then(createWindow)