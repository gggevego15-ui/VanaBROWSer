const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vanaBrowser', {
  navigate: (value, tabId) => ipcRenderer.invoke('navigate', value, tabId),
  newTab: (url) => ipcRenderer.invoke('new-tab', url),
  switchTab: (id) => ipcRenderer.invoke('switch-tab', id),
  closeTab: (id) => ipcRenderer.invoke('close-tab', id),
  action: (name) => ipcRenderer.send('browser-action', name),
  onTabsChanged: (callback) => ipcRenderer.on('tabs-changed', (_event, state) => callback(state)),
  onUrlChanged: (callback) => ipcRenderer.on('url-changed', (_event, url) => callback(url)),
  onNavigationError: (callback) => ipcRenderer.on('navigation-error', (_event, message) => callback(message))
});
