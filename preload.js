const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vanaBrowser', {
  navigate: (value) => ipcRenderer.invoke('navigate', value),
  action: (name) => ipcRenderer.send('browser-action', name),
  onUrlChanged: (callback) => ipcRenderer.on('url-changed', (_event, url) => callback(url)),
  onPageTitle: (callback) => ipcRenderer.on('page-title', (_event, title) => callback(title)),
  onNavigationError: (callback) => ipcRenderer.on('navigation-error', (_event, message) => callback(message))
});
