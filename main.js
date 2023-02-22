
const { win, BrowserWindow, app, ipcMain, Notification } = require("electron");

const { Client, Authenticator } = require('minecraft-launcher-core');

const path = require("path")

const launcher = new Client();

if (process.platform === 'win32')
{
    app.setAppUserModelId("Cookie Launcher");
}

const opts = {
    authorization: "",
    root: require("minecraft-folder-path"),
    version: {
        number: "1.19.2",
        type: "release"
    },
    memory: {
        max: "3G",
        min: "2G"
    },
    javaPath: "C:/Program Files/Java/jdk-17/bin/java.exe"
}

function launchMinecraft(username) {
    console.log(`${username} at launchMinecraft`)
    opts.authorization = Authenticator.getAuth(username)
    
    launcher.launch(opts);

    console.log(`${username} at launchMinecraft`)

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
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

ipcMain.on("launch", (_, username)  => {
    console.log(`${username} at ipcMain.on`)
    launchMinecraft(username)
})

app.whenReady().then(createWindow)