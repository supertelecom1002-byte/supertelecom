import { createFileRoute } from "@tanstack/react-router";

// Server-only: this key never ships in the client bundle.
const BOT_KEY =
  "2z0WBQVSHMj73kWrs1VVekY5ybOfUB0WlZ9IeKvPzZfgxMUQkczXOPntJ1DZFCGU";
const UPSTREAM = "https://katrix.app/api/widget/chat/stream";

const safeId = (v: unknown, fallback: string) =>
  typeof v === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(v) ? v : fallback;

export const Route = createFileRoute("/api/chat-stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const p = payload as Record<string, unknown>;
        const message = typeof p?.message === "string" ? p.message.trim() : "";
        if (!message || message.length > 2000) {
          return new Response("Bad request", { status: 400 });
        }
        const history = Array.isArray(p?.conversation_history)
          ? p.conversation_history
              .slice(-10)
              .filter(
                (h: unknown) =>
                  h &&
                  typeof (h as any).role === "string" &&
                  typeof (h as any).content === "string" &&
                  (h as any).content.length <= 2000,
              )
              .map((h: any) => ({
                role: h.role === "assistant" ? "assistant" : "user",
                content: String(h.content).slice(0, 2000),
              }))
          : [];

        const upstream = await fetch(UPSTREAM, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            bot_key: BOT_KEY,
            session_id: safeId(p?.session_id, "sess_server"),
            visitor_id: safeId(p?.visitor_id, "vis_server"),
            message,
            conversation_history: history,
          }),
        });

        return new Response(upstream.body, {
          status: upstream.status,
          headers: {
            "content-type":
              upstream.headers.get("content-type") || "application/json",
          },
        });
      },
    },
  },
});
