const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3813';

export async function apiFetch(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
