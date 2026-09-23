let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Short, subtle synth click for any interactive element. */
export function playClick(variant: "tap" | "soft" = "tap") {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(variant === "tap" ? 880 : 620, now);
  osc.frequency.exponentialRampToValueAtTime(variant === "tap" ? 320 : 260, now + 0.06);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(variant === "tap" ? 0.07 : 0.045, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** Global capture listener: click sound on every clickable element. */
export function installGlobalClickSound() {
  if (typeof document === "undefined") return () => {};
  const handler = (e: MouseEvent) => {
    const el = e.target as HTMLElement | null;
    if (!el) return;
    const hit = el.closest(
      "button, a, [role='button'], [role='tab'], input[type='checkbox'], input[type='radio'], label[data-click-sound], select, [data-click-sound]",
    );
    if (hit) playClick();
  };
  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}
