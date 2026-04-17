const BASE = "/api";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem("bomato_refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      localStorage.removeItem("bomato_refresh_token");
      return null;
    }
    const data = await res.json();
    accessToken = data.accessToken;
    if (data.refreshToken) {
      localStorage.setItem("bomato_refresh_token", data.refreshToken);
    }
    return data.accessToken;
  } catch {
    return null;
  }
}

async function ensureToken(): Promise<string | null> {
  if (accessToken) return accessToken;
  if (!refreshPromise) {
    refreshPromise = tryRefresh().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = false, headers: rawHeaders, ...init } = options;
  const headers = new Headers(rawHeaders as HeadersInit);

  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await ensureToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  } else if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && accessToken) {
    accessToken = null;
    const newToken = await ensureToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      const retryRes = await fetch(`${BASE}${path}`, { ...init, headers });
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({}));
        throw Object.assign(new Error(err?.error?.message ?? `HTTP ${retryRes.status}`), { status: retryRes.status, data: err });
      }
      return retryRes.json() as Promise<T>;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message ?? `HTTP ${res.status}`), { status: res.status, data: err });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
