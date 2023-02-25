const {
  BrowserWindow,
  app,
  ipcMain,
  Tray,
  Menu,
  Notification,
} = require("electron");

const { launch } = require('@xmcl/core');
const { login, Authentication, offline } = require('@xmcl/user');

const path = require("path");
const { electron } = require("process");

const fs = require('fs');

const gamePath = require("minecraft-folder-path")

const javaPath = "C:/Program Files/Java/jdk-17/bin/java.exe"

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let win;
let tray;
let tray_object;
let tray_object_2;

if (process.platform === "win32") {
  app.setAppUserModelId("Cookie Launcher");
}

function getVersions() {
  const versions_list = []
  fs.readdir(path.resolve(gamePath + "/versions/"), { withFileTypes: true }, (error, files) => {
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

async function launchMinecraft(username, version) {
  console.log(`${username} at launchMinecraft`);

  let authentication = offline(username);

  let accessToken = authentication.accessToken

  console.log(authentication)
  

  console.log(`${username} at launchMinecraft`);
  win.hide()
  tray.setContextMenu(tray_object_2)

  console.log(gamePath)
  console.log(javaPath)
  console.log(version)

  const process = await launch();

  // process.stdout.on('data', (b) => {
    // print mc output
  //  console.log(b.toString());
// });
  // process.stdout.on('exit', (b) => {
  //  win.show();
  //  win.webContents.send("log", "closed");
  //
  //  tray.setContextMenu(tray_object);
  //});
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

ipcMain.on("launch", async (_, username, version) => {
  console.log(`${username} at ipcMain.on`);
  await launchMinecraft(username, version);
});

app.whenReady().then(() => {
  createWindow();
  tray = new Tray(path.join(__dirname, "./public/logo.png"));

  tray_object_2 = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: function () {
        win.show();
        tray.setContextMenu(tray_object_2)
      },
    },
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ])

  tray_object = Menu.buildFromTemplate([
    {
      label: "Hide App",
      click: function () {
        win.hide();
        tray.setContextMenu(tray_object_2)
      },
    },
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ])

  tray.setContextMenu(tray_object)

  sleep(7000).then(() => {
    win.webContents.send("versions", Versions)
  })
});