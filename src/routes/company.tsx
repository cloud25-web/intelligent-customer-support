import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  Inbox,
  LifeBuoy,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import {
  knowledgeBase,
  metrics,
  tickets,
  type Department,
  type Ticket,
} from "@/lib/mock-data";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Agent Dashboard — Helix" },
      {
        name: "description",
        content:
          "Analytics, live ticket queue, triage insights, knowledge base and human escalation handoff packages.",
      },
      { property: "og:title", content: "Agent Dashboard — Helix" },
      {
        property: "og:description",
        content: "Everything an agent needs to resolve or take over an AI-triaged case.",
      },
    ],
  }),
  component: Company,
});

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "queue", label: "Tickets / Queue", icon: Inbox },
  { id: "triage", label: "Triage Insights", icon: Stethoscope },
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "escalations", label: "Escalations", icon: LifeBuoy },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

const companies = ["Northwind Retail", "Orbit Fintech", "Lumen Devices"];

function Company() {
  const [company, setCompany] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [selected, setSelected] = useState<Ticket>(tickets[2]!);

  if (!company) return <CompanyLogin onPick={setCompany} />;

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="border-b border-border bg-card lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">Helix</p>
            <p className="text-[11px] text-muted-foreground">{company}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="hidden px-5 py-4 lg:block">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Exit workspace
          </Link>
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card/70 px-5 py-4 backdrop-blur lg:px-8">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              {tabs.find((t) => t.id === tab)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              Live agent workspace · {tickets.length} active cases
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div key={tab} className="rise-in space-y-6 p-5 lg:p-8">
          {tab === "overview" && <Overview />}
          {tab === "queue" && <Queue onOpen={(t) => { setSelected(t); setTab("triage"); }} />}
          {tab === "triage" && <Triage selected={selected} onSelect={setSelected} />}
          {tab === "kb" && <Knowledge />}
          {tab === "escalations" && <Escalations />}
          {tab === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
}

function CompanyLogin({ onPick }: { onPick: (c: string) => void }) {
  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center px-5">
      <div className="surface-card w-full max-w-md p-7">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-teal-foreground">
            <Building2 className="h-5 w-5" />
          </span>
          <ThemeToggle />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Agent sign-in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Demo mode — pick a workspace to enter. No credentials needed.
        </p>
        <div className="mt-6 space-y-2.5">
          {companies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onPick(c)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
            >
              {c}
              <span className="text-xs font-normal text-muted-foreground">Enter →</span>
            </button>
          ))}
        </div>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to landing
        </Link>
      </div>
    </div>
  );
}

function Overview() {
  const max = Math.max(...metrics.volume.map((v) => v.value));
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total tickets" value={metrics.totalTickets.toLocaleString()} sub="last 30 days" />
        <Stat label="Escalation rate" value={`${metrics.escalationRate}%`} sub="-1.6% vs last month" />
        <Stat label="Avg resolution time" value={metrics.avgResolution} sub="AI-first handling" />
        <Stat label="Resolved by AI" value={`${metrics.aiResolved}%`} sub="without human touch" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Ticket volume this week</h3>
          <div className="mt-6 flex h-44 items-end gap-3">
            {metrics.volume.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80 transition-all duration-500 hover:bg-primary"
                  style={{ height: `${(d.value / max) * 100}%` }}
                  title={`${d.value} tickets`}
                />
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold">Sentiment breakdown</h3>
          <div className="mt-5 space-y-3.5">
            {metrics.sentiment.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${s.value}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-sm font-semibold">Department load</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {metrics.departments.map((d) => (
            <div key={d.name} className="rounded-xl bg-muted p-4">
              <p className="text-xs text-muted-foreground">{d.name}</p>
              <p className="mt-1 text-xl font-bold">{d.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="surface-card lift-hover p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

const depts: (Department | "All")[] = ["All", "Payments", "Orders", "Technical", "Refunds", "General"];

function Queue({ onOpen }: { onOpen: (t: Ticket) => void }) {
  const [dept, setDept] = useState<Department | "All">("All");
  const [sortUrgent, setSortUrgent] = useState(true);
  const order = { Critical: 4, High: 3, Medium: 2, Low: 1 } as const;

  const rows = useMemo(() => {
    const list = tickets.filter((t) => dept === "All" || t.department === dept);
    return sortUrgent ? [...list].sort((a, b) => order[b.urgency] - order[a.urgency]) : list;
  }, [dept, sortUrgent]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {depts.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDept(d)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              dept === d
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSortUrgent((s) => !s)}
          className="ml-auto rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Sort: {sortUrgent ? "Urgency" : "Newest"}
        </button>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border text-[11px] tracking-wide text-muted-foreground uppercase">
            <tr>
              {["Ticket", "Customer", "Intent", "Urgency", "Sentiment", "Department", "Status"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr
                key={t.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(t)}
                className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-muted/60"
              >
                <td className="px-4 py-3.5 font-semibold">{t.id}</td>
                <td className="px-4 py-3.5">{t.customer}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{t.intent}</td>
                <td className="px-4 py-3.5">
                  <Badge tone={t.urgency === "Critical" || t.urgency === "High" ? "danger" : "muted"}>
                    {t.urgency}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <Badge
                    tone={
                      t.sentiment === "Angry"
                        ? "danger"
                        : t.sentiment === "Frustrated"
                          ? "warn"
                          : "muted"
                    }
                  >
                    {t.sentiment}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">{t.department}</td>
                <td className="px-4 py-3.5">
                  <Badge tone={t.status === "Escalated" ? "danger" : t.status === "Resolved" ? "ok" : "info"}>
                    {t.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "danger" | "warn" | "ok" | "info";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    danger: "bg-destructive/12 text-destructive",
    warn: "bg-warning/18 text-foreground",
    ok: "bg-success/18 text-foreground",
    info: "bg-primary/12 text-primary",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Triage({ selected, onSelect }: { selected: Ticket; onSelect: (t: Ticket) => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div className="surface-card p-2">
        {tickets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
              selected.id === t.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <p className="text-xs font-bold">{t.id}</p>
            <p className="mt-0.5 truncate text-xs opacity-80">{t.intent}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold">{selected.intent}</h3>
              <p className="text-xs text-muted-foreground">
                {selected.id} · {selected.customer} · {selected.createdAt}
              </p>
            </div>
            <Badge tone={selected.status === "Escalated" ? "danger" : "info"}>{selected.status}</Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{selected.summary}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Gauge label="Severity" value={selected.severity / 5} display={`${selected.severity}/5`} />
            <Gauge
              label="AI confidence"
              value={selected.confidence}
              display={`${Math.round(selected.confidence * 100)}%`}
            />
            <Gauge
              label="Urgency"
              value={{ Low: 0.25, Medium: 0.5, High: 0.75, Critical: 1 }[selected.urgency]}
              display={selected.urgency}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="surface-card p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" /> Missing-info flags
            </h4>
            {selected.missingInfo.length ? (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {selected.missingInfo.map((m) => (
                  <li key={m} className="rounded-lg bg-warning/12 px-3 py-2 text-foreground">
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Nothing missing — case fully qualified.</p>
            )}
          </div>
          <div className="surface-card p-5">
            <h4 className="text-sm font-semibold">Knowledge used for grounding</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {selected.sources.map((s) => (
                <li key={s} className="rounded-lg bg-muted px-3 py-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gauge({ label, value, display }: { label: string; value: number; display: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{display}</p>
      <div className="mt-2 h-1.5 rounded-full bg-background">
        <div
          className="h-1.5 rounded-full bg-teal transition-all duration-700"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

function Knowledge() {
  const [q, setQ] = useState("");
  const results = knowledgeBase.filter((k) =>
    `${k.title} ${k.excerpt} ${k.department}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="surface-card flex items-center gap-2 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search policies, runbooks and docs…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((k) => (
          <article key={k.id} className="surface-card lift-hover p-5">
            <div className="flex items-center justify-between">
              <Badge tone="info">{k.department}</Badge>
              <span className="text-[11px] text-muted-foreground">Updated {k.updated}</span>
            </div>
            <h3 className="mt-3 font-semibold">{k.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{k.excerpt}</p>
            <p className="mt-3 text-[11px] font-semibold text-muted-foreground">{k.id}</p>
          </article>
        ))}
        {!results.length && (
          <p className="text-sm text-muted-foreground">No documents match “{q}”.</p>
        )}
      </div>
    </>
  );
}

function Escalations() {
  const t = tickets.find((x) => x.status === "Escalated")!;
  return (
    <div className="space-y-4">
      <div className="surface-card border-destructive/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
              Human handoff package
            </p>
            <h3 className="mt-1 text-lg font-bold">
              {t.id} · {t.intent}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.customer} · {t.department} · {t.createdAt}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
              Take ownership
            </button>
            <button className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
              Reassign
            </button>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm">
          <strong className="text-destructive">Escalation reason: </strong>
          {t.escalationReason}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Complaint summary">
          <p className="text-sm text-muted-foreground">{t.summary}</p>
        </Panel>
        <Panel title="Customer history">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {t.history.map((h) => (
              <li key={h} className="rounded-lg bg-muted px-3 py-2">
                {h}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Actions already attempted">
          <ol className="space-y-2 text-sm text-muted-foreground">
            {t.attempted.map((a, i) => (
              <li key={a} className="flex gap-2 rounded-lg bg-muted px-3 py-2">
                <span className="font-semibold text-foreground">{i + 1}.</span> {a}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Evidence attached">
          <div className="grid grid-cols-2 gap-2">
            {["Crash dialog screenshot", "Export settings panel"].map((label) => (
              <div
                key={label}
                className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-muted px-2 text-center text-[11px] text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Relevant knowledge sources">
          <ul className="space-y-2 text-sm">
            {t.sources.map((s) => (
              <li key={s} className="rounded-lg bg-accent px-3 py-2 text-accent-foreground">
                {s}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Triage signals">
          <div className="space-y-2 text-sm">
            <Row k="Severity" v={`${t.severity}/5`} />
            <Row k="Urgency" v={t.urgency} />
            <Row k="Sentiment" v={t.sentiment} />
            <Row k="AI confidence" v={`${Math.round(t.confidence * 100)}%`} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between rounded-lg bg-muted px-3 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-5">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      {children}
    </section>
  );
}

function Settings() {
  const { theme, toggle } = useTheme();
  const [prefs, setPrefs] = useState({
    escalationAlerts: true,
    dailyDigest: false,
    sentimentSpikes: true,
    soundEffects: true,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Appearance">
        <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3.5">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground">Currently {theme} mode</p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Switch to {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </Panel>
      <Panel title="Notifications">
        <div className="space-y-2.5">
          {(
            [
              ["escalationAlerts", "Escalation alerts", "Ping me when a case needs a human"],
              ["dailyDigest", "Daily digest", "Summary of resolved and open cases"],
              ["sentimentSpikes", "Sentiment spikes", "Alert on sudden anger trends"],
              ["soundEffects", "Interface sounds", "Click feedback across the workspace"],
            ] as const
          ).map(([key, label, sub]) => (
            <label
              key={key}
              data-click-sound
              className="flex cursor-pointer items-center justify-between rounded-xl bg-muted px-4 py-3"
            >
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{sub}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                className="h-5 w-5 accent-[var(--color-primary)]"
              />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  );
}
