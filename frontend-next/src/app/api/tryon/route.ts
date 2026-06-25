import { NextRequest, NextResponse } from "next/server";

const TAILORNET_API = "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const endpoint = request.nextUrl.searchParams.get("endpoint") || "try-on";

    const res = await fetch(`${TAILORNET_API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // No timeout on the server-side, TailorNet can take long
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      return NextResponse.json({ error: err.detail || "TailorNet error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Proxy error" }, { status: 500 });
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
