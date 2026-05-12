const { app, BrowserWindow, ipcMain, screen, Menu } = require("electron");
const path = require("path");

let win;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  win = new BrowserWindow({
    width: 240,
    height: 260,
    x: width - 300,
    y: height - 320,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  win.setAlwaysOnTop(true, "screen-saver");
  win.loadFile("index.html");

  ipcMain.on("move-by", (_event, delta) => {
    if (!win) return;
    const bounds = win.getBounds();
    const area = screen.getDisplayMatching(bounds).workArea;
    const nextX = clamp(bounds.x + Math.round(delta.x), area.x, area.x + area.width - bounds.width);
    const nextY = clamp(bounds.y + Math.round(delta.y), area.y, area.y + area.height - bounds.height);
    win.setPosition(nextX, nextY);
  });

  ipcMain.on("drag-to", (_event, point) => {
    if (!win) return;
    const bounds = win.getBounds();
    const area = screen.getDisplayMatching(bounds).workArea;
    const nextX = clamp(Math.round(point.x), area.x, area.x + area.width - bounds.width);
    const nextY = clamp(Math.round(point.y), area.y, area.y + area.height - bounds.height);
    win.setPosition(nextX, nextY);
  });

  ipcMain.handle("screen-bounds", () => {
    if (!win) return display.workArea;
    return screen.getDisplayMatching(win.getBounds()).workArea;
  });

  ipcMain.on("quit", () => {
    app.quit();
  });
}

Menu.setApplicationMenu(null);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
