const address = document.getElementById('address');
const heroAddress = document.getElementById('hero-address');
const startScreen = document.getElementById('start-screen');
const tabsList = document.getElementById('tabs-list');
const browserMenu = document.getElementById('browser-menu');
const toast = document.getElementById('toast');
let currentTabs = [];
let activeTabId = null;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function navigate(value) {
  const query = String(value || '').trim();
  if (!query) return;
  address.value = query;
  heroAddress.value = query;
  startScreen.style.display = 'none';
  browserMenu.hidden = true;
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
    title.addEventListener('click', () => selectTab(tab.id));
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
    item.addEventListener('click', () => selectTab(tab.id));
    tabsList.append(item);
  }
  const active = currentTabs.find((tab) => tab.id === activeTabId);
  if (active) {
    if (active.url) address.value = active.url;
    document.title = (active.title || 'Новая вкладка') + ' — VanaBROWSer';
  }
}

function selectTab(id) {
  startScreen.style.display = 'none';
  browserMenu.hidden = true;
  window.vanaBrowser.switchTab(id);
}

function saveBookmark() {
  const url = address.value.trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    showToast('Сначала открой сайт, который хочешь добавить');
    return;
  }
  let bookmarks = [];
  try { bookmarks = JSON.parse(localStorage.getItem('vana-bookmarks') || '[]'); } catch { bookmarks = []; }
  const existing = bookmarks.findIndex((item) => item.url === url);
  if (existing >= 0) {
    bookmarks.splice(existing, 1);
    document.getElementById('bookmark').classList.remove('saved');
    document.getElementById('bookmark').textContent = '☆';
    showToast('Закладка удалена');
  } else {
    const tab = currentTabs.find((item) => item.id === activeTabId);
    bookmarks.push({ url, title: tab?.title || url });
    document.getElementById('bookmark').classList.add('saved');
    document.getElementById('bookmark').textContent = '★';
    showToast('Добавлено в закладки');
  }
  localStorage.setItem('vana-bookmarks', JSON.stringify(bookmarks));
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
  browserMenu.hidden = true;
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
  browserMenu.hidden = true;
  window.vanaBrowser.action('home');
});
document.getElementById('bookmark').addEventListener('click', saveBookmark);
document.getElementById('profile').addEventListener('click', () => showToast('Профили пользователей — в будущих обновлениях'));
document.getElementById('site-info').addEventListener('click', () => {
  const url = address.value.trim();
  showToast(url.startsWith('https://') ? 'HTTPS: соединение использует шифрование' : 'Информация о текущем адресе');
});
document.getElementById('menu-toggle').addEventListener('click', () => {
  browserMenu.hidden = !browserMenu.hidden;
});
document.querySelectorAll('[data-menu-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.dataset.menuAction;
    browserMenu.hidden = true;
    if (action === 'new-tab') {
      startScreen.style.display = 'none';
      const id = await window.vanaBrowser.newTab();
      activeTabId = id || activeTabId;
    } else if (action === 'reload') {
      window.vanaBrowser.action('reload');
    } else if (action === 'bookmark') {
      saveBookmark();
    } else if (action === 'about') {
      alert('VanaBROWSer 0.3.0\nНастольный браузер на Chromium.\nИнтерфейс вдохновлён браузерами на основе Chromium.');
    }
  });
});
window.vanaBrowser.onTabsChanged(renderTabs);
window.vanaBrowser.onUrlChanged((url) => { address.value = url; });
window.vanaBrowser.onNavigationError((message) => {
  showToast('Не удалось открыть страницу. Проверь адрес и подключение к интернету.');
  console.error(message);
});
document.addEventListener('click', (event) => {
  if (!browserMenu.hidden && !browserMenu.contains(event.target) && !event.target.closest('#menu-toggle')) {
    browserMenu.hidden = true;
  }
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
  } else if (key === 'r') {
    event.preventDefault();
    window.vanaBrowser.action('reload');
  } else if (key === 'd') {
    event.preventDefault();
    saveBookmark();
  }
});
