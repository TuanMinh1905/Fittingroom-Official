// ===== TMFashion API Client =====
// Kết nối tới Hono backend tại port 8000

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

/**
 * Wrapper fetch cho API
 * Tự động gắn baseURL, JSON headers, auth token
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Lấy token từ localStorage (client-side only)
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("tmf_token") || "";
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      (errorData as { error?: string }).error || response.statusText
    );
  }

  // Trả về empty nếu 204
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Shorthand methods
export const api = {
  get: <T = unknown>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    apiFetch<T>(endpoint, { method: "GET", params }),

  post: <T = unknown>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T = unknown>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: "DELETE" }),
};
