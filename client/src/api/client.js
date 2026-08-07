const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const TOKEN_KEY = 'agentx_token';
export const USER_KEY = 'agentx_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  login: (uid, password) =>
    request('/auth/login', { method: 'POST', body: { uid, password }, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  chat: (query) => request('/chat', { method: 'POST', body: { query } }),
  ragSearch: (query, top_k = 3) =>
    request('/rag/search', { method: 'POST', body: { query, top_k } }),
  health: () => request('/health'),
  students: () => request('/students'),
  events: () => request('/events'),
  internships: () => request('/internships'),
  scholarships: () => request('/scholarships'),
  transport: () => request('/transport'),
  faqs: () => request('/faqs'),
  grievances: () => request('/grievances'),
  actionLog: () => request('/actionlog'),
  hitlRespond: (draft_id, action) =>
    request('/hitl/respond', { method: 'POST', body: { draft_id, action } }),
};