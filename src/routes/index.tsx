import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Compass,
  MessageSquareText,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  UserRound,
  Waypoints,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelect } from "@/components/LanguageSelect";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helix — Intelligent Customer Support & Escalation System" },
      {
        name: "description",
        content:
          "AI support platform with adaptive complaint triage, intelligent routing, knowledge-grounded answers and human escalation.",
      },
      { property: "og:title", content: "Helix — Intelligent Customer Support" },
      {
        property: "og:description",
        content:
          "Triage, route, resolve or escalate every complaint with full context for your human agents.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Compass, title: "Triage", text: "Adaptive questions fill the gaps a form would miss." },
  { icon: RouteIcon, title: "Route", text: "Intent, urgency and sentiment pick the right desk." },
  { icon: ShieldCheck, title: "Resolve or escalate", text: "Grounded answers, or a human handoff." },
  { icon: Waypoints, title: "Track", text: "Live status from received to resolved." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Helix</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </header>

      <section className="hero-gradient">
        <div className="mx-auto max-w-4xl px-5 pt-12 pb-16 text-center sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Intelligent Customer Support &
            Escalation System
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            Support that <span className="text-gradient">thinks before it routes</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Adaptive Complaint Triage • Intelligent Routing • Knowledge Reasoning • Human Handoff
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Helix listens to a complaint in plain language, asks only the questions it still needs,
            and either answers from your policies or hands a fully packaged case to a human.
          </p>

          <div className="mt-11 grid gap-5 text-left sm:grid-cols-2">
            <ChoiceCard
              to="/chat"
              icon={<UserRound className="h-6 w-6" />}
              title="I'm a Customer"
              text="Describe your issue in chat, attach a photo or speak it aloud, and track resolution live."
              cta="Open support chat"
            />
            <ChoiceCard
              to="/company"
              icon={<Building2 className="h-6 w-6" />}
              title="I'm a Company / Agent"
              text="Enter the agent workspace: analytics, live queue, triage insights and escalations."
              cta="Enter dashboard"
              accent
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-2xl font-bold tracking-tight">How it works</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Four steps between a frustrated message and a closed case.
        </p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="surface-card lift-hover p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" /> Helix demo — all data simulated on device.
          </span>
          <span>Built for adaptive triage demos</span>
        </div>
      </footer>
    </div>
  );
}

function ChoiceCard({
  to,
  icon,
  title,
  text,
  cta,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className="surface-card lift-hover group block p-7 hover:border-primary/60 active:scale-[0.99]"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
          accent ? "bg-teal text-teal-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {icon}
      </span>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
