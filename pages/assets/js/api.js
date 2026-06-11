const API_BASE_URL = window.location.origin;

export async function request(path, options = {}) {
  const session = getSession();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const payload = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || 'Nao foi possivel concluir a acao');
  }

  return payload;
}

export function getSession() {
  const rawSession = localStorage.getItem('explosion_session');
  return rawSession ? JSON.parse(rawSession) : null;
}

export function setSession(session) {
  localStorage.setItem('explosion_session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('explosion_session');
}
