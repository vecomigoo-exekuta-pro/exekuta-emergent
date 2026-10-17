import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageCircle, Send, UserRound, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SID_KEY = "exk_chat_sid";

const getSessionId = () => {
  let sid = localStorage.getItem(SID_KEY);
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(SID_KEY, sid);
  }
  return sid;
};

const TYPING_DOTS = (
  <span className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-acid" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [mode, setMode] = useState("semiauto");
  const [needsHuman, setNeedsHuman] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const endRef = useRef(null);

  const scrollEnd = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const start = async () => {
    const sid = getSessionId();
    try {
      const res = await fetch(`${API}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid }),
      });
      const data = await res.json();
      setMessages(data.messages || []);
      setQuickReplies(data.quickReplies || []);
      setMode(data.mode || "semiauto");
    } catch (e) {
      setMessages([{ role: "bot", text: "Não consegui carregar o atendimento agora. Tente novamente em instantes." }]);
    }
  };

  const onOpen = () => {
    setOpen(true);
    if (!started) {
      setStarted(true);
      setTyping(true);
      start().finally(() => setTyping(false));
    }
    scrollEnd();
  };

  useEffect(() => {
    if (open) scrollEnd();
  }, [messages, typing, open]);

  const send = async (text) => {
    const value = (text ?? "").trim();
    if (!value || typing) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setTyping(true);
    scrollEnd();
    try {
      const res = await fetch(`${API}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), text: value }),
      });
      const data = await res.json();
      if (data.reply) setMessages((m) => [...m, { role: "bot", text: data.reply }]);
      if (data.mode) setMode(data.mode);
      setNeedsHuman(!!data.needsHuman);
      setQuickReplies(data.quickReplies || []);
    } catch (e) {
      setMessages((m) => [...m, { role: "bot", text: "Tive um problema de conexão agora. Tente enviar novamente." }]);
    } finally {
      setTyping(false);
      scrollEnd();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : onOpen())}
        data-testid="chat-launcher"
        aria-label={open ? "Fechar atendimento" : "Abrir atendimento virtual"}
        className="group fixed bottom-6 right-6 z-[65] flex h-14 w-14 items-center justify-center rounded-full border border-acid/50 bg-card2 text-acid shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 transition-transform group-hover:-rotate-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-[65] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-card2 shadow-[0_24px_64px_rgba(0,0,0,0.6)] sm:right-6"
            data-testid="chat-window"
            role="dialog"
            aria-label="Atendimento virtual EXEKUTA"
          >
            <header className="flex items-center gap-3 border-b border-white/10 bg-surface px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-acid/15 text-acid">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold tracking-tight">EXEKUTA</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#60FF8B]" />
                  Assistente virtual{mode === "manual" ? " — com especialista" : ""}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar chat" className="rounded-full p-1.5 text-muted hover:text-paper">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role !== "user" && (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "admin" ? "bg-white/10 text-paper" : "bg-acid/15 text-acid"}`}>
                      {m.role === "admin" ? <UserRound className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </span>
                  )}
                  <p
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-acid text-ink"
                        : m.role === "admin"
                          ? "rounded-bl-sm border border-acid/40 bg-surface text-paper"
                          : "rounded-bl-sm bg-surface text-paper"
                    }`}
                    data-testid={`chat-msg-${m.role}-${i}`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acid/15 text-acid"><Bot className="h-3.5 w-3.5" /></span>
                  <div className="rounded-2xl rounded-bl-sm bg-surface px-4 py-3">{TYPING_DOTS}</div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {quickReplies.length > 0 && !typing && (
              <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 pt-3" data-testid="chat-quick-replies">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-acid/35 px-3 py-1.5 text-xs font-medium text-acid transition-colors hover:bg-acid hover:text-ink"
                  >
                    {q}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => send("Quero falar com um especialista.")}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-paper transition-colors hover:border-acid hover:text-acid"
                  data-testid="chat-human-request"
                >
                  Falar com especialista
                </button>
              </div>
            )}

            {needsHuman && (
              <p className="px-4 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#60FF8B]" data-testid="chat-human-flag">
                Sinalizado para atendimento humano — um especialista da EXEKUTA vai te responder aqui.
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(text);
              }}
              className="flex items-center gap-2 p-3"
              data-testid="chat-form"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
                data-testid="chat-input"
                className="w-full rounded-full border border-white/15 bg-black px-4 py-2.5 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid"
              />
              <button
                type="submit"
                disabled={!text.trim() || typing}
                aria-label="Enviar mensagem"
                data-testid="chat-send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-acid text-ink transition-transform hover:scale-105 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="pb-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Você está falando com um assistente virtual. Dados usados conforme a LGPD.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
