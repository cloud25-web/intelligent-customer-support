import { Globe } from "lucide-react";
import { languages, useLang, type LangCode } from "@/lib/i18n";

export function LanguageSelect() {
  const { lang, setLang, t } = useLang();
  return (
    <label
      data-click-sound
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      title={t("langLabel")}
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">{t("langLabel")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="cursor-pointer bg-transparent text-xs font-medium outline-none"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-card text-foreground">
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
