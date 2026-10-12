const address = document.getElementById('address');
const heroAddress = document.getElementById('hero-address');
const startScreen = document.getElementById('start-screen');
const tabsList = document.getElementById('tabs-list');
let currentTabs = [];
let activeTabId = null;

function navigate(value) {
  const query = String(value || '').trim();
  if (!query) return;
  address.value = query;
  heroAddress.value = query;
  startScreen.style.display = 'none';
  window.vanaBrowser.navigate(query, activeTabId);
}

function renderTabs(state) {
  currentTabs = state.tabs || [];
  activeTabId = state.activeTabId;
  tabsList.replaceChildren();
  for (const tab of currentTabs) {
    const item = document.createElement('div');
    item.className = 'tab' + (tab.id === activeTabId ? ' active' : '');
    item.setAttribute('role', 'tab');
    item.setAttribute('aria-selected', String(tab.id === activeTabId));
    item.title = tab.url || tab.title;
    const favicon = document.createElement('span');
    favicon.className = 'tab-favicon' + (tab.loading ? ' loading' : '');
    favicon.textContent = tab.loading ? '◌' : '◈';
    const title = document.createElement('button');
    title.className = 'tab-title';
    title.type = 'button';
    title.textContent = tab.title || 'Новая вкладка';
    title.addEventListener('click', () => {
      startScreen.style.display = 'none';
      window.vanaBrowser.switchTab(tab.id);
    });
    const close = document.createElement('button');
    close.className = 'tab-close';
    close.type = 'button';
    close.textContent = '×';
    close.title = 'Закрыть вкладку';
    close.setAttribute('aria-label', 'Закрыть вкладку ' + (tab.title || ''));
    close.addEventListener('click', (event) => {
      event.stopPropagation();
      window.vanaBrowser.closeTab(tab.id);
    });
    item.append(favicon, title, close);
    item.addEventListener('click', () => {
      startScreen.style.display = 'none';
      window.vanaBrowser.switchTab(tab.id);
    });
    tabsList.append(item);
  }
  const active = currentTabs.find((tab) => tab.id === activeTabId);
  if (active) {
    if (active.url) address.value = active.url;
    document.title = (active.title || 'Новая вкладка') + ' — VanaBROWSer';
  }
}

document.getElementById('address-form').addEventListener('submit', (event) => {
  event.preventDefault();
  navigate(address.value);
});
document.getElementById('hero-form').addEventListener('submit', (event) => {
  event.preventDefault();
  navigate(heroAddress.value);
});
document.querySelectorAll('[data-url]').forEach((button) => {
  button.addEventListener('click', () => navigate(button.dataset.url));
});
document.getElementById('new-tab').addEventListener('click', async () => {
  startScreen.style.display = 'none';
  address.value = '';
  const id = await window.vanaBrowser.newTab();
  activeTabId = id || activeTabId;
});
document.getElementById('back').addEventListener('click', () => window.vanaBrowser.action('back'));
document.getElementById('forward').addEventListener('click', () => window.vanaBrowser.action('forward'));
document.getElementById('reload').addEventListener('click', () => window.vanaBrowser.action('reload'));
document.getElementById('home').addEventListener('click', () => {
  address.value = '';
  heroAddress.value = '';
  startScreen.style.display = 'grid';
  window.vanaBrowser.action('home');
});
document.getElementById('about').addEventListener('click', () => {
  alert('VanaBROWSer 0.2.0\nНастольный браузер на Chromium.\nПоддерживаются вкладки, открытие, переключение и закрытие вкладок.');
});
window.vanaBrowser.onTabsChanged(renderTabs);
window.vanaBrowser.onUrlChanged((url) => { address.value = url; });
window.vanaBrowser.onNavigationError((message) => {
  alert('Не удалось открыть страницу. Проверь адрес и подключение к интернету.\n' + message);
});
document.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey)) return;
  const key = event.key.toLowerCase();
  if (key === 't') {
    event.preventDefault();
    document.getElementById('new-tab').click();
  } else if (key === 'w') {
    event.preventDefault();
    window.vanaBrowser.closeTab(activeTabId);
  } else if (key === 'l') {
    event.preventDefault();
    address.focus();
    address.select();
  }
});
