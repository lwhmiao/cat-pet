const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("petWindow", {
  moveBy: (x, y) => ipcRenderer.send("move-by", { x, y }),
  dragTo: (x, y) => ipcRenderer.send("drag-to", { x, y }),
  screenBounds: () => ipcRenderer.invoke("screen-bounds"),
  quit: () => ipcRenderer.send("quit")
});
