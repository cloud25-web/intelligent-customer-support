export type Department = "Payments" | "Orders" | "Technical" | "Refunds" | "General";
export type Status = "Received" | "Triaged" | "Routed" | "Resolved" | "Escalated";

export type Ticket = {
  id: string;
  customer: string;
  intent: string;
  summary: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Angry";
  department: Department;
  status: Status;
  confidence: number;
  severity: number;
  missingInfo: string[];
  attempted: string[];
  history: string[];
  sources: string[];
  escalationReason?: string;
  createdAt: string;
};

export const tickets: Ticket[] = [
  {
    id: "TCK-4821",
    customer: "Ananya Rao",
    intent: "Double charge on subscription",
    summary:
      "Customer was billed twice for the Pro plan in the same billing cycle after updating their card.",
    urgency: "High",
    sentiment: "Frustrated",
    department: "Payments",
    status: "Routed",
    confidence: 0.92,
    severity: 4,
    missingInfo: ["Last 4 digits of card"],
    attempted: ["Verified billing records", "Matched duplicate charge ID", "Offered instant refund"],
    history: ["Pro plan since Mar 2024", "2 prior tickets, both resolved", "Lifetime value ₹84,000"],
    sources: ["Billing Policy v4 §2.1", "Duplicate Charge Runbook"],
    createdAt: "Today, 09:12",
  },
  {
    id: "TCK-4822",
    customer: "Marcus Bell",
    intent: "Order not delivered",
    summary: "Parcel marked delivered 3 days ago but never received; courier scan shows wrong pin.",
    urgency: "Medium",
    sentiment: "Neutral",
    department: "Orders",
    status: "Triaged",
    confidence: 0.81,
    severity: 3,
    missingInfo: ["Photo of delivery area", "Preferred resolution"],
    attempted: ["Pulled courier tracking", "Checked neighbour drop-off note"],
    history: ["12 orders, 1 prior delay", "Member since 2022"],
    sources: ["Shipping SLA §5", "Lost Parcel Policy"],
    createdAt: "Today, 08:40",
  },
  {
    id: "TCK-4823",
    customer: "Priya Sharma",
    intent: "App crashes on export",
    summary: "Desktop app crashes when exporting reports larger than 50MB on v3.2.1.",
    urgency: "Critical",
    sentiment: "Angry",
    department: "Technical",
    status: "Escalated",
    confidence: 0.74,
    severity: 5,
    missingInfo: ["Crash log file", "OS build number"],
    attempted: ["Reproduced on v3.2.1", "Suggested chunked export", "Cleared local cache"],
    history: ["Enterprise account, 240 seats", "Renewal in 28 days", "3 open tickets"],
    sources: ["Known Issue KB-118", "Enterprise Escalation Matrix"],
    escalationReason:
      "Enterprise account at renewal risk, repeated failure after two AI-suggested workarounds, severity 5 data-loss potential.",
    createdAt: "Today, 07:55",
  },
  {
    id: "TCK-4824",
    customer: "Diego Ferrer",
    intent: "Refund status unclear",
    summary: "Refund approved 6 days ago, customer asking why funds have not landed.",
    urgency: "Low",
    sentiment: "Neutral",
    department: "Refunds",
    status: "Resolved",
    confidence: 0.96,
    severity: 2,
    missingInfo: [],
    attempted: ["Explained 5-7 day bank window", "Shared refund reference"],
    history: ["4 orders", "No prior escalations"],
    sources: ["Refund Timelines §1"],
    createdAt: "Yesterday, 18:20",
  },
  {
    id: "TCK-4825",
    customer: "Leah Kim",
    intent: "How to invite teammates",
    summary: "Usage misunderstanding — customer looked for invites under Billing instead of Team.",
    urgency: "Low",
    sentiment: "Positive",
    department: "General",
    status: "Resolved",
    confidence: 0.99,
    severity: 1,
    missingInfo: [],
    attempted: ["Sent step-by-step guide", "Linked Team Settings doc"],
    history: ["Starter plan", "First ticket"],
    sources: ["Getting Started: Teams"],
    createdAt: "Yesterday, 15:02",
  },
];

export const knowledgeBase = [
  {
    id: "KB-101",
    title: "Billing Policy v4",
    department: "Payments" as Department,
    excerpt:
      "Duplicate charges detected within one cycle are refunded automatically within 24 hours, no approval needed under ₹10,000.",
    updated: "12 Sep 2026",
  },
  {
    id: "KB-104",
    title: "Shipping SLA & Lost Parcel Policy",
    department: "Orders" as Department,
    excerpt:
      "A parcel scanned delivered but unreceived triggers a courier trace at 48h and a free reship at 96h.",
    updated: "02 Sep 2026",
  },
  {
    id: "KB-118",
    title: "Known Issue: Large Export Crash",
    department: "Technical" as Department,
    excerpt:
      "v3.2.1 exports above 50MB exhaust memory on Windows builds. Workaround: chunked export. Fix targeted for v3.3.",
    updated: "19 Sep 2026",
  },
  {
    id: "KB-122",
    title: "Refund Timelines",
    department: "Refunds" as Department,
    excerpt:
      "Approved refunds settle in 5-7 business days depending on issuing bank; reference IDs are shareable with customers.",
    updated: "28 Aug 2026",
  },
  {
    id: "KB-130",
    title: "Getting Started: Teams",
    department: "General" as Department,
    excerpt:
      "Teammate invites live under Settings → Team → Invite, not under Billing. Seats are billed at next cycle.",
    updated: "05 Sep 2026",
  },
  {
    id: "KB-141",
    title: "Enterprise Escalation Matrix",
    department: "Technical" as Department,
    excerpt:
      "Severity 4-5 issues on accounts above 100 seats escalate to a named human agent within 30 minutes.",
    updated: "16 Sep 2026",
  },
];

export const metrics = {
  totalTickets: 1284,
  escalationRate: 8.4,
  avgResolution: "6m 12s",
  aiResolved: 82,
  sentiment: [
    { label: "Positive", value: 38, color: "var(--color-success)" },
    { label: "Neutral", value: 34, color: "var(--color-teal)" },
    { label: "Frustrated", value: 19, color: "var(--color-warning)" },
    { label: "Angry", value: 9, color: "var(--color-destructive)" },
  ],
  volume: [
    { day: "Mon", value: 148 },
    { day: "Tue", value: 192 },
    { day: "Wed", value: 174 },
    { day: "Thu", value: 233 },
    { day: "Fri", value: 261 },
    { day: "Sat", value: 132 },
    { day: "Sun", value: 104 },
  ],
  departments: [
    { name: "Payments", value: 34 },
    { name: "Orders", value: 26 },
    { name: "Technical", value: 21 },
    { name: "Refunds", value: 12 },
    { name: "General", value: 7 },
  ],
};

export const statusFlow: Status[] = ["Received", "Triaged", "Routed", "Resolved"];
