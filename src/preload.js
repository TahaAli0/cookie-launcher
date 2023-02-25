
const {ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    launcherApi : {
        sendToLauncher(username, version) {
            ipcRenderer.send("launch", username, version)
        }
    },
    consoleApi : {
        receiveLog(message) {
            ipcRenderer.on("log", message)
        }
    },
    versionsApi : {
        receiveVersions(list) {
            ipcRenderer.on("versions", list)
        }
    }
})