
const { win, BrowserWindow, app, ipcMain, Notification } = require("electron");

const path = require("path")

if (process.platform === 'win32')
{
    app.setAppUserModelId("Cookie Launcher");
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#282b30",
        autoHideMenuBar: true,
        resizable: false,
        icon: path.resolve(__dirname, '/public/logo.png'),
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.setIcon(path.join(__dirname, '/public/logo.png'));
    win.loadFile("./public/index.html")
}

ipcMain.on("notify", (_, message) => {
    new Notification({title: "Notification", body: message}).show();
})

app.whenReady().then(createWindow)