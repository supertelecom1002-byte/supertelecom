import { useEffect, useRef, useState } from "react";
import { Send, Bot, Search, Wrench, Clock, CheckCircle2, PhoneCall } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";
import { lookupRepairStatus, type RepairStatusEntry } from "@/lib/repair-status.functions";

// Chat requests are proxied through /api/chat-stream so the vendor key
// stays server-side and never ships in the client bundle.
const CHAT_API = "/api/chat-stream";
const SID_KEY = "st_chat_sid";

type Msg = {
  role: "user" | "assistant";
  content: string;
  entries?: RepairStatusEntry[];
};

function randomId(prefix: string) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return (
    prefix +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

const GREETING =
  "Namaste! Main Super Telecom ka AI assistant hoon. Mobile repair, display ya battery replacement, second-hand phones, accessories, pricing ya repair status — kuch bhi poochiye.";

const SUGGESTIONS = [
  "Repair status check karna hai",
  "Display replacement ka price kya hai?",
  "Battery kitni der me change hoti hai?",
  "Shop ka address aur timing?",
];

const STATUS_INTENT =
  /(repair\s*status|status\s*check|check\s*status|order\s*status|mera\s*phone\s*(kab|ready)|phone\s*ready)/i;

const STATUS_ASK =
  "Zaroor! Apna registered mobile number (10 digits) ya phone ka IMEI number bhejiye — main aapki repair ka live status nikaal deta hoon.";

function extractLookupDigits(text: string): string | null {
  const digits = text.replace(/[^0-9]/g, "");
  const wordy = text.replace(/[0-9\s+\-()]/g, "").trim().length > 3;
  if (wordy) return null;
  if (digits.length >= 10 && digits.length <= 16) return digits;
  return null;
}

function statusTone(status: string) {
  const s = status.toLowerCase();
  if (/(ready|complete|done|delivered|pickup)/.test(s))
    return { Icon: CheckCircle2, label: "Ready", cls: "text-accent" };
  if (/(progress|repair|working|parts|waiting)/.test(s))
    return { Icon: Wrench, label: "In progress", cls: "text-primary" };
  return { Icon: Clock, label: "Received", cls: "text-muted-foreground" };
}

function StatusCard({ entry }: { entry: RepairStatusEntry }) {
  const { Icon, label, cls } = statusTone(entry.status);
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          {entry.model || entry.service || "Repair job"}
        </p>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${cls}`}>
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground">{entry.status}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {entry.name && (
          <div className="col-span-2 flex gap-1.5">
            <dt>Customer:</dt>
            <dd className="text-foreground">{entry.name}</dd>
          </div>
        )}
        {entry.service && (
          <div className="flex gap-1.5">
            <dt>Service:</dt>
            <dd className="text-foreground">{entry.service}</dd>
          </div>
        )}
        {entry.bookedAt && (
          <div className="flex gap-1.5">
            <dt>Booked:</dt>
            <dd className="text-foreground">{entry.bookedAt}</dd>
          </div>
        )}
        {entry.statusUpdated && (
          <div className="flex gap-1.5">
            <dt>Updated:</dt>
            <dd className="text-foreground">{entry.statusUpdated}</dd>
          </div>
        )}
        {entry.estimatedReady && (
          <div className="flex gap-1.5">
            <dt>Ready by:</dt>
            <dd className="text-foreground">{entry.estimatedReady}</dd>
          </div>
        )}
      </dl>
      <a
        href="tel:+918002903643"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
      >
        <PhoneCall className="h-3 w-3" /> Call shop for details
      </a>
    </div>
  );
}

export function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const awaitingStatusRef = useRef(false);
  const sessionRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lookupStatus = useServerFn(lookupRepairStatus);


  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem(SID_KEY) || "";
    } catch {
      /* ignore */
    }
    if (!sid) {
      sid = randomId("sess_");
      try {
        localStorage.setItem(SID_KEY, sid);
      } catch {
        /* ignore */
      }
    }
    sessionRef.current = sid;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  async function runStatusLookup(query: string, history: Msg[]) {
    setSending(true);
    try {
      const result = await lookupStatus({ data: { query } });
      awaitingStatusRef.current = false;
      if (!result.ok) {
        setMessages([
          ...history,
          {
            role: "assistant",
            content:
              "Abhi status system se connect nahi ho pa raha. Please +91 80029 03643 par call kariye — hum turant bata denge.",
          },
        ]);
      } else if (result.entries.length === 0) {
        awaitingStatusRef.current = true;
        setMessages([
          ...history,
          {
            role: "assistant",
            content:
              "Is number/IMEI par koi repair record nahi mila. Kripya wahi mobile number bhejiye jo booking ke time diya tha, ya +91 80029 03643 par call kariye.",
          },
        ]);
      } else {
        setMessages([
          ...history,
          {
            role: "assistant",
            content:
              result.entries.length > 1
                ? `Aapke ${result.entries.length} repair records mile — latest sabse upar hai:`
                : "Yeh raha aapki repair ka current status:",
            entries: result.entries,
          },
        ]);
      }
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Status check karte waqt problem aa gayi. Please +91 80029 03643 par call kariye.",
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || sending) return;
    const history = [...messages, { role: "user" as const, content: msg }];
    setMessages(history);
    setInput("");

    const digits = extractLookupDigits(msg);
    if (digits && (awaitingStatusRef.current || digits.length >= 10)) {
      await runStatusLookup(digits, history);
      return;
    }

    if (STATUS_INTENT.test(msg)) {
      awaitingStatusRef.current = true;
      setMessages([...history, { role: "assistant", content: STATUS_ASK }]);
      inputRef.current?.focus();
      return;
    }

    setSending(true);


    const payload = {
      session_id: sessionRef.current || randomId("sess_"),
      visitor_id: randomId("vis_"),
      message: msg,
      conversation_history: history
        .slice(-10)
        .map((h) => ({ role: h.role, content: h.content })),

    };

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) throw new Error("request failed");

      if (ct.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let live = "";
        let started = false;
        let done = false;
        while (!done) {
          const chunk = await reader.read();
          if (chunk.done) break;
          buf += decoder.decode(chunk.value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const frame = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            let event = "message";
            let dataStr = "";
            frame.split("\n").forEach((line) => {
              if (line.startsWith("event:")) event = line.slice(6).trim();
              else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
            });
            if (!dataStr) continue;
            let data: any;
            try {
              data = JSON.parse(dataStr);
            } catch {
              continue;
            }
            if (event === "delta" && data.text) {
              live += data.text;
              if (!started) {
                started = true;
                setMessages((m) => [...m, { role: "assistant", content: live }]);
              } else {
                setMessages((m) => {
                  const next = [...m];
                  next[next.length - 1] = { role: "assistant", content: live };
                  return next;
                });
              }
            } else if (event === "done") {
              done = true;
              const final = data?.message?.content || live;
              setMessages((m) => {
                const next = [...m];
                if (started) next[next.length - 1] = { role: "assistant", content: final };
                else next.push({ role: "assistant", content: final });
                return next;
              });
            }
          }
        }
        if (!done && !started) throw new Error("empty stream");
      } else {
        const data = await res.json();
        const reply =
          data?.message?.content || "Sorry, I could not process that.";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, abhi connect nahi ho pa raha. Aap humein +91 80029 03643 par call kar sakte hain.",
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section id="ai-assistant" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary">
            <Bot className="h-3.5 w-3.5" /> AI Assistant · 24×7
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-gradient">Super Telecom AI Assistant</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Ask anything about mobile repair, display replacement, battery
            replacement, second-hand phones, accessories, pricing, or repair
            status.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl glass shadow-elegant">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <img
              src="/super-telecom-logo.png"
              alt="Super Telecom logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-contain bg-black/60 p-0.5 border border-white/10"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Super Telecom AI</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Online
              </p>
            </div>
            <button
              type="button"
              onClick={() => send("Repair status check karna hai")}
              disabled={sending}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Search className="h-3 w-3" /> Repair status
            </button>
          </div>


          <div
            ref={scrollRef}
            className="h-[420px] space-y-4 overflow-y-auto px-4 py-5 md:h-[520px] md:px-6"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground md:text-[15px]"
                      : "max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-secondary-foreground md:text-[15px]"
                  }
                >
                  {m.content}
                  {m.entries && m.entries.length > 0 && (
                    <div className="mt-3 space-y-3 whitespace-normal">
                      {m.entries.map((e, j) => (
                        <StatusCard key={j} entry={e} />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-6">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-border p-3 md:p-4"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Type your question…"
              aria-label="Message the Super Telecom AI assistant"
              className="max-h-32 flex-1 resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring md:text-[15px]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
