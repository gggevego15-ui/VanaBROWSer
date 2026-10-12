const address = document.getElementById('address');
const heroAddress = document.getElementById('hero-address');
const startScreen = document.getElementById('start-screen');

function navigate(value) {
  const query = String(value || '').trim();
  if (!query) return;
  address.value = query;
  heroAddress.value = query;
  startScreen.style.display = 'none';
  window.vanaBrowser.navigate(query);
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
  alert('VanaBROWSer 0.1.0\nНастольный браузер на Chromium.\nСледующий этап: вкладки, история и закладки.');
});
window.vanaBrowser.onUrlChanged((url) => { address.value = url; });
window.vanaBrowser.onPageTitle((title) => { document.title = title + ' — VanaBROWSer'; });
window.vanaBrowser.onNavigationError((message) => {
  alert('Не удалось открыть страницу. Проверь адрес и подключение к интернету.\n' + message);
});
