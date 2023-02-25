const {
  BrowserWindow,
  app,
  ipcMain,
  Tray,
  Menu,
  Notification,
} = require("electron");

const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();

const path = require("path");
const { electron } = require("process");

const fs = require('fs');
const yaml = require("js-yaml");

const gamePath = require("minecraft-folder-path");

const javaPath = "C:/Program Files/Java/jdk-17/bin/java.exe"

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let win;
let tray;
let tray_object;
let tray_object_2;
let opts;

if (process.platform === "win32") {
  app.setAppUserModelId("Cookie Launcher");
}

function getVersions() {
  const versions_list = []

  let yamlFile = fs.readFileSync(__dirname + "/public/java.yaml", "utf8");

  let loadedYaml = yaml.load(yamlFile);

  for (let i in loadedYaml) {
    versions_list.push({
      label: loadedYaml[i][0], value: loadedYaml[i][0]
    })
  }

  return versions_list
};

const Versions = getVersions();

async function launchMinecraft(username, version) {
  console.log(`${username} at launchMinecraft`);

  let opts = {
    // For production launchers, I recommend not passing 
    // the getAuth function through the authorization field and instead
    // handling authentication outside before you initialize
    // MCLC so you can handle auth based errors and validation!
    authorization: Authenticator.getAuth(username),
    root: gamePath,
    version: {
        number: version,
        type: "release"
    },
    memory: {
        max: "2G",
        min: "1G"
    },
    javaPath: javaPath
  };

  console.log(`${username} at launchMinecraft`);
  win.hide();
  tray.setContextMenu(tray_object_2);

  console.log(gamePath);
  console.log(javaPath);
  console.log(version);

  launcher.launch(opts);
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

  launcher.on('debug', (e) => {
    win.webContents.send("log", e);
    console.log(e)
  });
  launcher.on('data', (e) => {
    win.webContents.send("log", e);
    console.log(e)
  });

  launcher.on("close", (e) => {
    win.show();
    win.webContents.send("log", "closed");
    tray.setContextMenu(tray_object);
  })
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