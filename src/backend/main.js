import { app, BrowserWindow } from "electron";
const path = require("node:path");
import db from "./util/db";
db.init();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  var desktop_wh = db.get("desktop_wh");
  var desktop_wz = db.get("desktop_wz");
  console.log(desktop_wh, desktop_wz);
  if (!desktop_wh) {
    desktop_wh = "400,300";
  }
  if (!desktop_wz) {
    desktop_wz = "356,429";
  }
  var arr_wh = desktop_wh.split(",");
  var arr_wz = desktop_wz.split(",");

  var width = parseInt(arr_wh[0]);
  var height = parseInt(arr_wh[1]);

  var x = parseInt(arr_wz[1]);
  var y = parseInt(arr_wz[0]);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    useContentSize: true,
    width: width,
    height: height,
    y: x,
    x: y,
    maximizable: false,
    minimizable: false,
    transparent: false,
    resizable: true,
    frame: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  mainWindow.setOpacity(1.0);
  mainWindow.setAlwaysOnTop(true);
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on("resize", () => {
    var size = mainWindow.getSize();
    db.set("desktop_wh", size[0].toString() + "," + size[1].toString());
  });

  mainWindow.on("move", () => {
    var position = mainWindow.getPosition();
    db.set("desktop_wz", position[0].toString() + "," + position[1].toString());
    // Open the DevTools.
  });
  mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
