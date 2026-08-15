// src/api/client.js – Centralized API fetch wrapper for One Stop
// All requests go through this module to ensure consistent token handling,
// error normalization, and base URL management.
//
// Usage:
//   import api from '@/api/client';
//   const { data, error } = await api.get('/courses');
//   const { data, error } = await api.post('/assessment/submit', { answers });

const BASE_URL = '/api'; // resolved via vite proxy in dev, same-origin in prod

function getToken() {
  return localStorage.getItem('onestop_token');
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { error: text || 'Unknown error' }; }

    if (!res.ok) {
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }
    return { data: json, error: null };
  } catch (err) {
    // Network error (offline)
    if (!navigator.onLine) {
      return { data: null, error: 'You are offline. Please check your internet connection.' };
    }
    return { data: null, error: err.message || 'Network error' };
  }
}

const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
  patch:  (path, body)   => request('PATCH',  path, body),
};

export default api;
