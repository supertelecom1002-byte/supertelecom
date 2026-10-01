import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  Sparkles,
  X,
  Wrench,
  Clock,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { lookupRepairStatus, type RepairStatusEntry } from "@/lib/repair-status.functions";
import { BrandLogo } from "@/components/BrandLogo";

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
  "Namaste! Main Super Telecom ka AI assistant hoon. Mobile repair, display ya battery replacement, pricing ya repair status — kuch bhi poochiye.";

const SUGGESTIONS = [
  "Display replacement ka price kya hai?",
  "Battery kitni der me change hoti hai?",
  "Repair status check karna hai",
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
    return { Icon: CheckCircle2, label: "Ready", cls: "text-emerald-500" };
  if (/(progress|repair|working|parts|waiting)/.test(s))
    return { Icon: Wrench, label: "In progress", cls: "text-cyan-500" };
  return { Icon: Clock, label: "Received", cls: "text-slate-400" };
}

function StatusCard({ entry }: { entry: RepairStatusEntry }) {
  const { Icon, label, cls } = statusTone(entry.status);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-sm text-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-slate-900 dark:text-white">
          {entry.model || entry.service || "Repair job"}
        </p>
        <span className={`flex items-center gap-1 font-semibold ${cls}`}>
          <Icon className="h-3 w-3" /> {label}
        </span>
      </div>
      <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">{entry.status}</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
        {entry.name && (
          <div className="col-span-2 flex gap-1">
            <dt>Customer:</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-200">{entry.name}</dd>
          </div>
        )}
        {entry.service && (
          <div className="flex gap-1">
            <dt>Service:</dt>
            <dd className="text-slate-800 dark:text-slate-200">{entry.service}</dd>
          </div>
        )}
        {entry.bookedAt && (
          <div className="flex gap-1">
            <dt>Booked:</dt>
            <dd className="text-slate-800 dark:text-slate-200">{entry.bookedAt}</dd>
          </div>
        )}
      </dl>
      <a
        href="tel:+918002903643"
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <PhoneCall className="h-3 w-3 text-cyan-500" /> Call shop
      </a>
    </div>
  );
}

export const FloatingAiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages, sending, isOpen]);

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
                ? `Aapke ${result.entries.length} repair records mile:`
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
            "Sorry, abhi connect nahi ho pa raha. Aap humein +91 80029 03643 par direct call ya WhatsApp kar sakte hain.",
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      <div className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Super Telecom AI Assistant"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
          >
            {/* Active Pulsing Ring */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
            <Bot className="h-6 w-6 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 border-2 border-white dark:border-slate-950">
              ✓
            </span>
          </button>
        )}
      </div>

      {/* Floating Popup Card (Desktop) / Slide-up Sheet (Mobile) */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col md:inset-auto md:bottom-8 md:right-8 md:w-[420px] md:h-[580px]">
          {/* Mobile backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-t-3xl md:rounded-3xl bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:border shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Super Telecom AI
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instant Giridih Repair Estimates
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950 text-xs"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-cyan-600 dark:bg-cyan-500 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.entries && m.entries.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {m.entries.map((entry, eIdx) => (
                          <StatusCard key={eIdx} entry={entry} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex items-center gap-1.5 text-slate-400 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                  <span className="text-[11px]">Analyzing repair query...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 p-2.5">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Frequently Asked:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => send(s)}
                      disabled={sending}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
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
                  placeholder="Ask about display price, battery, or status..."
                  className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAiChat;
