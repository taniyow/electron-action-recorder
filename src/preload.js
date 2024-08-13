// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startRecording: () => ipcRenderer.send("start-recording"),
  stopRecording: () => ipcRenderer.send("stop-recording"),
  replayActions: () => ipcRenderer.send("replay-actions"),
  onStartShortcut: (callback) => ipcRenderer.on("start-shortcut", callback),
  onStopShortcut: (callback) => ipcRenderer.on("stop-shortcut", callback),
  onReplayShortcut: (callback) => ipcRenderer.on("replay-shortcut", callback),
});
