const BASE_URL = '/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data;
}

export function apiGet<T = unknown>(path: string, params?: Record<string, string>) {
  const searchParams = params ? '?' + new URLSearchParams(params).toString() : '';
  return api<T>(`${path}${searchParams}`);
}

export function apiPost<T = unknown>(path: string, body: unknown) {
  return api<T>(path, { method: 'POST', body });
}

export function apiPatch<T = unknown>(path: string, body: unknown) {
  return api<T>(path, { method: 'PATCH', body });
}

export function apiPut<T = unknown>(path: string, body: unknown) {
  return api<T>(path, { method: 'PUT', body });
}

export function apiDelete<T = unknown>(path: string) {
  return api<T>(path, { method: 'DELETE' });
}
