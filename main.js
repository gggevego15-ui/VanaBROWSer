const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('node:path');

let win;
let pageView;
let pageAttached = false;
const BAR_HEIGHT = 82;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 520,
    backgroundColor: '#0b0d12',
    title: 'VanaBROWSer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  pageView = new BrowserView({
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  pageView.webContents.loadURL('https://www.google.com');
  win.on('resize', resizePage);
  win.on('closed', () => { win = null; pageView = null; pageAttached = false; });

  pageView.webContents.on('page-title-updated', (_event, title) => {
    if (win) win.webContents.send('page-title', title);
  });
  pageView.webContents.on('did-navigate', (_event, url) => {
    if (win) win.webContents.send('url-changed', url);
  });
  pageView.webContents.on('did-navigate-in-page', (_event, url) => {
    if (win) win.webContents.send('url-changed', url);
  });
}

function attachPage() {
  if (!win || !pageView) return;
  if (!pageAttached) {
    win.setBrowserView(pageView);
    pageAttached = true;
  }
  resizePage();
}

function showHome() {
  if (win && pageAttached) {
    win.removeBrowserView(pageView);
    pageAttached = false;
  }
}

function resizePage() {
  if (!win || !pageView || !pageAttached) return;
  const [width, height] = win.getContentSize();
  pageView.setBounds({ x: 0, y: BAR_HEIGHT, width, height: Math.max(100, height - BAR_HEIGHT) });
  pageView.setAutoResize({ width: true, height: true });
}

function resolveAddress(input) {
  const value = String(input || '').trim();
  if (!value) return 'https://www.google.com';
  if (/^(https?:\/\/|file:\/\/)/i.test(value)) return value;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?([/?#].*)?$/i.test(value)) return 'http://' + value;
  if (/^(\S+\.)+[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(value) && !/\s/.test(value)) {
    return 'https://' + value;
  }
  return 'https://www.google.com/search?q=' + encodeURIComponent(value);
}

ipcMain.handle('navigate', async (_event, input) => {
  if (!pageView) return;
  const url = resolveAddress(input);
  attachPage();
  try {
    await pageView.webContents.loadURL(url);
  } catch (error) {
    if (win) win.webContents.send('navigation-error', error.message);
  }
});
ipcMain.on('browser-action', (_event, action) => {
  if (!pageView) return;
  if (action === 'back' && pageView.webContents.canGoBack()) pageView.webContents.goBack();
  if (action === 'forward' && pageView.webContents.canGoForward()) pageView.webContents.goForward();
  if (action === 'reload') pageView.webContents.reload();
  if (action === 'home') showHome();
});
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
