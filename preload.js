
const {ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    notificationApi : {
        sendNotification(message) {
            ipcRenderer.send("notify", message)
        }
    },
    launcherApi : {
        sendToLauncher(username) {
            ipcRenderer.send("launch", username)
        }
    }
})