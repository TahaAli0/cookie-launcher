
const {ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    launcherApi : {
        sendToLauncher(username) {
            ipcRenderer.send("launch", username)
        }
    },
    consoleApi : {
        recieveLog(message) {
            ipcRenderer.send("log", message)
        }
    }
})