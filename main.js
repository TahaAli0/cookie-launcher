const {
  BrowserWindow,
  app,
  ipcMain,
  Tray,
  Menu,
  Notification,
} = require("electron");

const { Client, Authenticator } = require("minecraft-launcher-core");

const path = require("path");
const { electron } = require("process");

const fs = require('fs');

const mc_path = require("minecraft-folder-path")

const launcher = new Client();

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let win;
let tray;

if (process.platform === "win32") {
  app.setAppUserModelId("Cookie Launcher");
}

function getVersions() {
  const versions_list = []
  fs.readdir(path.resolve(mc_path + "/versions/"), { withFileTypes: true }, (error, files) => {
  const directoriesInDIrectory = files
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
  
    for (let i in directoriesInDIrectory) {
      versions_list.push({
        label: directoriesInDIrectory[i],
        value: directoriesInDIrectory[i]
      })
    }
  })
  return versions_list
};

const Versions = getVersions()

const opts = {
  authorization: "",
  root: mc_path,
  version: {
    number: "1.19.2",
    type: "release",
  },
  memory: {
    max: "3G",
    min: "2G",
  },
  javaPath: "C:/Program Files/Java/jdk-17/bin/java.exe",
};

function launchMinecraft(username) {
  console.log(`${username} at launchMinecraft`);
  opts.authorization = Authenticator.getAuth(username);

  launcher.launch(opts);

  console.log(`${username} at launchMinecraft`);
  win.hide();

  launcher.on("debug", (e) => win.webContents.send("log", e));
  launcher.on("data", (e) => win.webContents.send("log", e));
  launcher.on("close", (e) => {
    win.show();
    win.webContents.send("log", "closed");
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#282b30",
    autoHideMenuBar: true,
    resizable: false,
    icon: path.resolve(__dirname, "/public/logo.png"),
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setIcon(path.join(__dirname, "/public/logo.png"));
  win.loadFile("./public/index.html");
}

ipcMain.on("launch", (_, username) => {
  console.log(`${username} at ipcMain.on`);
  launchMinecraft(username);
});

app.whenReady().then(() => {
  createWindow();
  tray = new Tray(path.join(__dirname, "./public/logo.png"));

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: function () {
          win.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          app.quit();
        },
      },
    ])
    );
    sleep(7000).then(() => {
      win.webContents.send("versions", Versions)
    })
  });