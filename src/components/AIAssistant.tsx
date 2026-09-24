import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

type M = { id: number; from: "ai" | "user"; text: string };

function answerKey(text: string) {
  const t = text.toLowerCase();
  if (/(status|track|ट्रैक|स्थिति|ট্র্যাক|అవస్థ|ಸ್ಥಿತಿ|நிலை)/.test(t)) return "aStatus";
  if (/(refund|money|रिफंड|पैसा|রিফান্ড|ರೀಫಂಡ್|மீள|రీఫండ్|પરત)/.test(t)) return "aRefund";
  if (/(escalat|human|agent help|एस्कल|इंसान|মানব|మానవ|ಮಾನವ|மனித)/.test(t)) return "aEscalate";
  if (/(company|dashboard|agent|कंपनी|डैशबोर्ड|এজেন্ট|ಏಜೆಂಟ್|ஏஜென்ட்)/.test(t)) return "aAgent";
  return "aDefault";
}

export function AIAssistant() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ id: 1, from: "ai", text: t("asstGreet") }]);
  }, [lang, t]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  function send() {
    const body = input.trim();
    if (!body) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "user", text: body }]);
    setInput("");
    setTyping(true);
    const key = answerKey(body);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "ai", text: t(key) }]);
    }, 750);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("asstOpen")}
          title={t("asstOpen")}
          className="fixed right-5 bottom-20 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-primary p-3.5 text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 sm:bottom-5"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="surface-card fixed right-4 bottom-4 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden p-0 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{t("asstTitle")}</p>
                <p className="text-[11px] text-muted-foreground">{t("asstSub")}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-card text-card-foreground"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 px-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("asstPlaceholder")}
              className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
            />
            <button
              type="button"
              onClick={send}
              aria-label="Send"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
