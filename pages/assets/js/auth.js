import { request, setSession } from './api.js';

const form = document.querySelector('[data-auth-form]');
const message = document.querySelector('[data-message]');
const mode = document.body.dataset.mode;

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message show ${type}`;
}

function setLoading(isLoading) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Aguarde...' : button.dataset.label;
}

function getFormPayload() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

async function handleLogin(payload) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  setSession(response.data);
  window.location.href = '/home.html';
}

async function handleRegister(payload) {
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  showMessage('Cadastro criado. Redirecionando para o login...', 'success');

  setTimeout(() => {
    window.location.href = '/auth/login.html';
  }, 1000);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true);

  try {
    const payload = getFormPayload();

    if (mode === 'register') {
      await handleRegister(payload);
      return;
    }

    await handleLogin(payload);
  } catch (error) {
    showMessage(error.message);
  } finally {
    setLoading(false);
  }
});
