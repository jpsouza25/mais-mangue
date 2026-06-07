export interface User {
  id: number;
  usuario: string;
  nome_completo: string;
  email: string;
  data_nascimento: string;
  genero: string;
}

export interface ApiResult {
  success: boolean;
  message?: string;
}

export interface RegisterPayload {
  usuario: string;
  nome_completo: string;
  email: string;
  data_nascimento: string;
  genero: string;
  senha: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options,
  });
  return res.json() as Promise<T>;
}

export function login(usuario: string, senha: string): Promise<ApiResult> {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, senha }),
  });
}

export function register(payload: RegisterPayload): Promise<ApiResult> {
  return request('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout(): Promise<ApiResult> {
  return request('/api/logout', { method: 'POST' });
}

export async function getMe(): Promise<{ authenticated: boolean; user?: User }> {
  const res = await fetch('/api/me', { credentials: 'same-origin' });
  if (!res.ok) return { authenticated: false };
  return res.json();
}

export function listUsers(): Promise<User[]> {
  return request('/api/users');
}

export function updateUser(
  id: number,
  data: Omit<User, 'id'>,
): Promise<ApiResult> {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: number): Promise<ApiResult> {
  return request(`/api/users/${id}`, { method: 'DELETE' });
}

export function updatePassword(id: number, senha: string): Promise<ApiResult> {
  return request(`/api/users/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ senha }),
  });
}
