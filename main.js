const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron');
const path = require('node:path');

let win;
let tabs = [];
let activeTabId = null;
let nextTabId = 1;
const CHROME_HEIGHT = 126;

function activeTab() {
  return tabs.find((tab) => tab.id === activeTabId) || null;
}

function sendTabs() {
  if (!win || win.isDestroyed()) return;
  win.webContents.send('tabs-changed', {
    tabs: tabs.map(({ id, title, url, loading }) => ({ id, title, url, loading })),
    activeTabId
  });
}

function resizeActiveView() {
  if (!win || win.isDestroyed()) return;
  const tab = activeTab();
  if (!tab) return;
  const [width, height] = win.getContentSize();
  tab.view.setBounds({ x: 0, y: CHROME_HEIGHT, width, height: Math.max(100, height - CHROME_HEIGHT) });
}

function attachTabView(tab) {
  if (!win || !tab) return;
  for (const other of tabs) {
    if (other.attached) {
      win.contentView.removeChildView(other.view);
      other.attached = false;
    }
  }
  if (!tab.attached) {
    win.contentView.addChildView(tab.view);
    tab.attached = true;
  }
  activeTabId = tab.id;
  resizeActiveView();
  sendTabs();
}

function resolveAddress(input) {
  const value = String(input || '').trim();
  if (!value) return 'https://www.google.com';
  if (/^(https?:\/\/|file:\/\/)/i.test(value)) return value;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?([/?#].*)?$/i.test(value)) return 'http://' + value;
  if (/^(\S+\.)+[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(value) && !/\s/.test(value)) return 'https://' + value;
  return 'https://www.google.com/search?q=' + encodeURIComponent(value);
}

function createTab(initialUrl = '', shouldAttach = true) {
  if (!win) return null;
  const id = String(nextTabId++);
  const view = new WebContentsView({
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  const tab = { id, view, title: 'Новая вкладка', url: '', loading: false, attached: false };
  tabs.push(tab);
  view.webContents.setWindowOpenHandler(({ url }) => {
    createTab(url);
    return { action: 'deny' };
  });
  view.webContents.on('page-title-updated', (_event, title) => {
    tab.title = title || 'Без названия';
    sendTabs();
  });
  view.webContents.on('did-start-loading', () => {
    tab.loading = true;
    sendTabs();
  });
  view.webContents.on('did-stop-loading', () => {
    tab.loading = false;
    sendTabs();
  });
  const updateUrl = (_event, url) => {
    tab.url = url;
    sendTabs();
    if (win && activeTabId === tab.id) win.webContents.send('url-changed', url);
  };
  view.webContents.on('did-navigate', updateUrl);
  view.webContents.on('did-navigate-in-page', updateUrl);
  view.webContents.on('render-process-gone', () => {
    tab.title = 'Страница аварийно завершилась';
    sendTabs();
  });
  if (shouldAttach) attachTabView(tab);
  else { activeTabId = tab.id; sendTabs(); }
  if (initialUrl) navigateTab(tab, initialUrl);
  else view.webContents.loadURL('https://www.google.com').catch(() => {});
  return tab;
}

async function navigateTab(tab, input) {
  if (!tab) return;
  const url = resolveAddress(input);
  attachTabView(tab);
  try {
    await tab.view.webContents.loadURL(url);
  } catch (error) {
    if (win) win.webContents.send('navigation-error', error.message);
  }
}

function closeTab(id) {
  const index = tabs.findIndex((tab) => tab.id === String(id));
  if (index < 0) return;
  const [tab] = tabs.splice(index, 1);
  if (tab.attached && win) win.contentView.removeChildView(tab.view);
  tab.attached = false;
  tab.view.webContents.close();
  if (!tabs.length) {
    createTab();
    return;
  }
  if (activeTabId === tab.id) {
    const next = tabs[Math.max(0, index - 1)];
    attachTabView(next);
  } else {
    sendTabs();
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 520,
    backgroundColor: '#090a10',
    title: 'VanaBROWSer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
  win.on('resize', resizeActiveView);
  win.on('closed', () => {
    for (const tab of tabs) {
      if (!tab.view.webContents.isDestroyed()) tab.view.webContents.close();
    }
    tabs = [];
    activeTabId = null;
    win = null;
  });
  createTab('', false);
}

ipcMain.handle('navigate', async (_event, input, tabId) => {
  const tab = tabs.find((item) => item.id === String(tabId)) || activeTab();
  await navigateTab(tab, input);
});
ipcMain.handle('new-tab', (_event, input) => {
  const tab = createTab(input || '');
  return tab ? tab.id : null;
});
ipcMain.handle('switch-tab', (_event, id) => {
  const tab = tabs.find((item) => item.id === String(id));
  if (tab) attachTabView(tab);
});
ipcMain.handle('close-tab', (_event, id) => closeTab(id));
ipcMain.on('browser-action', (_event, action) => {
  const tab = activeTab();
  if (!tab) return;
  const contents = tab.view.webContents;
  if (action === 'back' && contents.canGoBack()) contents.goBack();
  if (action === 'forward' && contents.canGoForward()) contents.goForward();
  if (action === 'reload') contents.reload();
  if (action === 'home') {
    if (tab.attached && win) {
      win.contentView.removeChildView(tab.view);
      tab.attached = false;
    }
    sendTabs();
  }
});
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
