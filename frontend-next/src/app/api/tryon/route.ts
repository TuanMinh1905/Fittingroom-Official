import { NextRequest, NextResponse } from "next/server";

const TAILORNET_API = "http://localhost:8000";
// TailorNet inference có thể mất 20–60s, set timeout 90s để tránh treo vô hạn
const TIMEOUT_MS = 90_000;
// Retry 1 lần khi fetch failed (Docker container bị restart tạm thời)
const MAX_RETRIES = 1;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, TIMEOUT_MS);
      return res;
    } catch (err: any) {
      const isLastAttempt = attempt === retries;
      const isAbort = err?.name === "AbortError";
      if (isLastAttempt) throw err;
      // Chỉ retry khi là network error (fetch failed), không retry AbortError (timeout)
      if (isAbort) throw err;
      // Chờ 2s trước khi retry để Docker container kịp phục hồi
      console.warn(`[tryon proxy] fetch failed (attempt ${attempt + 1}), retrying in 2s...`, err?.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const endpoint = request.nextUrl.searchParams.get("endpoint") || "try-on";

    const res = await fetchWithRetry(`${TAILORNET_API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      return NextResponse.json({ error: err.detail || "TailorNet error", detail: err.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    const isTimeout = e?.name === "AbortError";
    const msg = isTimeout
      ? "TailorNet mất quá nhiều thời gian xử lý (>90s). Vui lòng thử lại!"
      : (e.message || "Proxy error");
    return NextResponse.json({ error: msg }, { status: isTimeout ? 504 : 500 });
  }
}

export async function GET() {
  try {
    const res = await fetch(`${TAILORNET_API}/health`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 503 });
  }
}
