import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  MenuItem,
  globalShortcut,
} from "electron";
const fs = require("fs");
const path = require("node:path");
import db from "./util/db";
db.init();
var editor_window = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  var desktop_wh = db.get("desktop_wh");
  var desktop_wz = db.get("desktop_wz");
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
  //设置快捷键
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "my",
      submenu: [
        {
          label: "Opacity-",
          visible: false,
          accelerator: "-",
          click: () => {
            mainWindow.setOpacity(mainWindow.getOpacity() - 0.1);
          },
        },
        {
          label: "Opacity+",
          accelerator: "=",
          click: () => {
            mainWindow.setOpacity(mainWindow.getOpacity() + 0.1);
          },
        },
        {
          label: "hideMuen",
          accelerator: "c",
          click: () => {
            mainWindow.webContents.send("shortcut", "showMenu"); // 发送事件到渲染进程
          },
        },
      ],
    })
  );
  Menu.setApplicationMenu(menu);
  mainWindow.setOpacity(0.5);
  mainWindow.setAlwaysOnTop(true);
  editor_window = mainWindow;

  globalShortcut.register("CommandOrControl+S", () => {
    mainWindow.webContents.send("shortcut", "save"); // 发送事件到渲染进程
  });

  globalShortcut.register("CommandOrControl+M", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

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
  //mainWindow.webContents.openDevTools();
};

ipcMain.handle("readFile", async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    console.error("Failed to read file:", error);
    throw error;
  }
});

ipcMain.handle("writeFile", async (event, { filePath, content }) => {
  try {
    await fs.promises.writeFile(filePath, content, "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write file:", error);
    throw error;
  }
});
ipcMain.handle("getFilePath", async (event) => {
  try {
    return db.get("filePath");
  } catch (error) {
    console.error("Failed to get file path:", error);
    throw error;
  }
});

ipcMain.handle("setFilePath", async (event, filePath) => {
  try {
    db.set("filePath", filePath);
    return true;
  } catch (error) {
    console.error("Failed to set file path:", error);
    throw error;
  }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const icon_path = path.join(__dirname, "static", "work.svg");
  console.log("icon_path", icon_path);
  const icon = nativeImage.createFromPath(icon_path);
  const tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "editor",
      type: "radio",
      click: () => {
        if (editor_window === null) {
          createWindow();
        } else {
          editor_window.close();
          editor_window = null;
        }
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("clike menu to open window");
  tray.setTitle("hidet");

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
