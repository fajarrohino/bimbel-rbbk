// API Client — HTTP layer with auto token refresh
// Access token is stored in memory (not localStorage) because refresh token is in httpOnly cookie.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthExpiredError extends Error {
  constructor() {
    super('Session expired. Please login again.');
    this.name = 'AuthExpiredError';
  }
}

// In-memory access token storage
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function clearAccessToken() {
  _accessToken = null;
}

// Build request headers
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }
  return headers;
}

// Attempt to refresh the access token
async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) {
      clearAccessToken();
      return false;
    }
    const data = await res.json();
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    clearAccessToken();
    return false;
  } catch {
    clearAccessToken();
    return false;
  }
}

// Core fetch with auto-retry on 401
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | boolean | undefined>,
  isRetry = false
): Promise<T> {
  let url = `${BASE_URL}${path}`;

  // Append query params
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += `?${qs}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: buildHeaders(),
    credentials: 'include',
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    fetchOptions.body = '{}';
  }

  const res = await fetch(url, fetchOptions);

  if (res.status === 401 && !isRetry) {
    // Try to refresh token once
    const refreshed = await tryRefreshToken();
    if (!refreshed) {
      throw new AuthExpiredError();
    }
    // Retry original request with new token
    return request<T>(method, path, body, params, true);
  }

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (typeof errData.error === 'string') {
        errorMsg = errData.error;
      } else if (errData.message) {
        errorMsg = errData.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  // Handle empty responses (e.g. 204 No Content)
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
}

// HTTP helpers
export const apiClient = {
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return request<T>('GET', path, undefined, params);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body);
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body);
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PATCH', path, body);
  },

  delete_<T>(path: string): Promise<T> {
    return request<T>('DELETE', path);
  },
};

export default apiClient;

