import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useLang } from "@/lib/i18n";
import { statusFlow, type Status } from "@/lib/mock-data";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Support Chat — Helix" },
      {
        name: "description",
        content:
          "Describe your issue in plain language, attach photo or voice evidence, and watch your complaint move from received to resolved.",
      },
      { property: "og:title", content: "Support Chat — Helix" },
      {
        property: "og:description",
        content: "Adaptive AI triage chat with camera and voice evidence capture.",
      },
    ],
  }),
  component: CustomerChat,
});

type Msg = {
  id: number;
  from: "ai" | "user";
  text: string;
  image?: string | undefined;
  at: string;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

type Probe = { key: string; ask: string; match: (t: string) => boolean };

const probes: Probe[] = [
  {
    key: "order",
    ask: "probeOrder",
    match: (t) => /\b[a-z]{2,4}-?\d{3,}\b/i.test(t) || /order\s*(id|no|number)/i.test(t) || /\d{4,}/.test(t),
  },
  {
    key: "when",
    ask: "probeWhen",
    match: (t) => /(today|yesterday|day|week|month|ago|\/|\d{1,2}\s?(st|nd|rd|th))/i.test(t),
  },
  {
    key: "evidence",
    ask: "probeEvidence",
    match: (t) => t === "__image__",
  },
  {
    key: "outcome",
    ask: "probeOutcome",
    match: (t) => /(refund|replace|explain|fix|cancel|credit|apolog)/i.test(t),
  },
];

function classify(text: string) {
  const t = text.toLowerCase();
  if (/(charge|billing|payment|card|invoice|double)/.test(t))
    return { dept: "Payments", urgency: "High", kb: "Billing Policy v4 §2.1" };
  if (/(deliver|parcel|shipment|order|courier|package)/.test(t))
    return { dept: "Orders", urgency: "Medium", kb: "Shipping SLA §5" };
  if (/(crash|bug|error|login|app|slow|export)/.test(t))
    return { dept: "Technical", urgency: "Critical", kb: "Known Issue KB-118" };
  if (/(refund|money back|return)/.test(t))
    return { dept: "Refunds", urgency: "Medium", kb: "Refund Timelines §1" };
  return { dept: "General", urgency: "Low", kb: "Getting Started guide" };
}

function CustomerChat() {
  const { t, lang, speechLang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "ai", text: t("greeting"), at: now() },
  ]);

  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0]?.from === "ai" ? [{ ...m[0], text: t("greeting") }] : m,
    );
  }, [lang, t]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<Status>("Received");
  const [answered, setAnswered] = useState<string[]>([]);
  const [triage, setTriage] = useState<{ dept: string; urgency: string; kb: string } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => () => stopCamera(), []);

  function push(msg: Omit<Msg, "id" | "at">) {
    setMessages((m) => [...m, { ...msg, id: Date.now() + Math.random(), at: now() }]);
  }

  function aiReply(userText: string, hasImage: boolean) {
    setTyping(true);
    const answeredNow = [...answered];
    probes.forEach((p) => {
      if (!answeredNow.includes(p.key) && p.match(hasImage ? "__image__" : userText))
        answeredNow.push(p.key);
    });
    setAnswered(answeredNow);

    const tri = triage ?? classify(userText);
    if (!triage) setTriage(tri);

    const next = probes.find((p) => !answeredNow.includes(p.key));

    window.setTimeout(() => {
      setTyping(false);
      if (messages.length <= 1) {
        push({
          from: "ai",
          text: `${t("gotIt", { dept: tri.dept, urgency: tri.urgency })} ${next ? t(next.ask) : ""}`,
        });
        setStatus("Triaged");
        return;
      }
      if (next) {
        push({ from: "ai", text: t(next.ask) });
        setStatus("Triaged");
        return;
      }
      setStatus("Routed");
      window.setTimeout(() => {
        if (tri.urgency === "Critical") {
          push({ from: "ai", text: t("escalate", { dept: tri.dept, kb: tri.kb }) });
          setStatus("Escalated");
        } else {
          push({
            from: "ai",
            text: t("resolve", {
              dept: tri.dept,
              kb: tri.kb,
              ref: `HLX-${Math.floor(1000 + Math.random() * 8999)}`,
            }),
          });
          setStatus("Resolved");
        }
      }, 1100);
    }, 900);
  }

  function send(text?: string, image?: string) {
    const body = (text ?? input).trim();
    if (!body && !image) return;
    push({ from: "user", text: body || t("sharedPhoto"), image });
    setInput("");
    aiReply(body, Boolean(image));
  }

  async function openCamera() {
    setNotice(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setCameraOpen(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      }, 50);
    } catch {
      setNotice(t("cameraBlocked"));
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    send(t("photoMsg"), dataUrl);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => send(t("fileMsg"), String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function toggleMic() {
    setNotice(null);
    if (recording) {
      recogRef.current?.stop();
      setRecording(false);
      return;
    }
    const SR =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setNotice(t("micUnsupported"));
      return;
    }
    const recog = new SR();
    recog.lang = speechLang;
    recog.interimResults = true;
    recog.continuous = false;
    recog.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput(text);
    };
    recog.onerror = () => {
      setNotice(t("micBlocked"));
      setRecording(false);
    };
    recog.onend = () => setRecording(false);
    recogRef.current = recog;
    recog.start();
    setRecording(true);
  }

  const stepIndex = status === "Escalated" ? 3 : statusFlow.indexOf(status);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{t("assistantName")}</p>
              <p className="text-[11px] text-muted-foreground">{t("assistantSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 pt-5">
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            <span>{t("statusLabel")}</span>
            <span className={status === "Escalated" ? "text-destructive" : "text-teal"}>{t(status)}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {["Received", "Triaged", "Routed", status === "Escalated" ? "Escalated" : "Resolved"].map(
              (label, i) => (
                <div key={t(label)} className="flex flex-1 items-center gap-2">
                  <div className="w-full">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i <= stepIndex
                          ? status === "Escalated" && i === 3
                            ? "bg-destructive"
                            : "bg-teal"
                          : "bg-muted"
                      }`}
                    />
                    <p
                      className={`mt-1.5 text-[11px] ${i <= stepIndex ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                    >
                      {t(label)}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
          {triage && (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <Chip>{t("dept")}: {triage.dept}</Chip>
              <Chip>{t("urgency")}: {triage.urgency}</Chip>
              <Chip>{t("grounded")}: {triage.kb}</Chip>
            </div>
          )}
        </div>
      </div>

      <main ref={scrollRef} className="mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rise-in flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                m.from === "user"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm border border-border bg-card text-card-foreground"
              }`}
            >
              {m.image && (
                <img
                  src={m.image}
                  alt="Evidence attached by customer"
                  className="mb-2 max-h-52 w-full rounded-lg object-cover"
                />
              )}
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <p
                className={`mt-1.5 text-[10px] ${m.from === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {m.at}
              </p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {notice && (
        <div className="mx-auto w-full max-w-3xl px-5 pb-2">
          <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-foreground">
            {notice}
          </p>
        </div>
      )}

      <footer className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-end gap-2 px-5 py-3.5">
          <IconBtn label="Capture evidence with camera" onClick={openCamera}>
            <Camera className="h-[18px] w-[18px]" />
          </IconBtn>
          <IconBtn label="Upload a file" onClick={() => fileRef.current?.click()}>
            <Paperclip className="h-[18px] w-[18px]" />
          </IconBtn>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <IconBtn
            label={recording ? "Stop recording" : "Speak your complaint"}
            onClick={toggleMic}
            active={recording}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-[18px] w-[18px]" />}
          </IconBtn>
          <div className="relative flex-1">
            {recording && (
              <span className="absolute -top-7 left-0 inline-flex items-center gap-1.5 rounded-full bg-destructive/12 px-2.5 py-1 text-[11px] font-semibold text-destructive">
                <span className="rec-dot h-2 w-2 rounded-full bg-destructive" /> {t("listening")}
              </span>
            )}
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t("placeholder")}
              className="max-h-32 w-full resize-none rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => send()}
            aria-label="Send message"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>
      </footer>

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
          <div className="surface-card w-full max-w-md overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Camera preview</p>
              <button type="button" onClick={stopCamera} aria-label="Close camera">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <video
              ref={videoRef}
              playsInline
              muted
              className="mt-3 aspect-video w-full rounded-xl bg-black object-cover"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Frame the issue, then confirm to attach the photo to your complaint.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={capture}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4" /> Capture & attach
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted px-2.5 py-1 font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${
        active
          ? "border-destructive bg-destructive/12 text-destructive"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
