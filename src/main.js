const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');
const robot = require("robotjs");

// Store mouse actions
let actions = [];
let recordingInterval = null;

console.log("dirname:", __dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      preload: path.join(__dirname, "../renderer/main_window/preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // IPC Event Handlers
  ipcMain.on("start-recording", () => {
    actions = [];
    recordingInterval = setInterval(() => {
      const mousePos = robot.getMousePos();
      actions.push({ type: "move", x: mousePos.x, y: mousePos.y });
    }, 100);
  });

  ipcMain.on("stop-recording", () => {
    clearInterval(recordingInterval);
  });

  ipcMain.on("replay-actions", () => {
    actions.forEach((action, index) => {
      setTimeout(() => {
        if (action.type === "move") {
          robot.moveMouse(action.x, action.y);
        }
      }, index * 100);
    });
  });

  // Register keyboard shortcut listeners.
  globalShortcut.register("Ctrl+R", () => {
    mainWindow.webContents.send("start-shortcut");
  });

  globalShortcut.register("Ctrl+S", () => {
    mainWindow.webContents.send("stop-shortcut");
  });

  globalShortcut.register("Ctrl+F", () => {
    mainWindow.webContents.send("replay-shortcut");
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cleanup global shortcuts when the app will quit.
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
