export const adminSurfaceStyles = {
  appBackground:
    "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_100%)] text-slate-900",
  header:
    "sticky top-0 z-10 border-b border-cyan-100/80 bg-white/90 shadow-sm shadow-cyan-100/60 backdrop-blur",
  navContainer:
    "mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4",

  card:
    "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-cyan-100/40",
  cardInteractive:
    "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-cyan-100/40 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md hover:shadow-cyan-100/70",
  mutedPanel:
    "rounded-2xl border border-cyan-100 bg-cyan-50/40 shadow-sm shadow-cyan-100/50",
  sectionPanel:
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-cyan-100/40",
  heroPanel:
    "rounded-3xl border border-cyan-100 bg-white/95 p-8 shadow-sm shadow-cyan-100/70",
  infoPanel:
    "rounded-2xl border border-cyan-100 bg-cyan-50/70 p-6 shadow-sm shadow-cyan-100/60",
  successPanel:
    "rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm shadow-emerald-100/70",
  warningPanel:
    "rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm shadow-amber-100/70",
  dangerPanel:
    "rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm shadow-rose-100/70",
  emptyPanel:
    "rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm shadow-cyan-100/40",
  tablePanel:
    "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-cyan-100/40",
};

export const adminTextStyles = {
  eyebrow:
    "mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700",
  pageTitle:
    "text-3xl font-bold tracking-tight text-slate-950 md:text-5xl",
  pageTitleSm:
    "text-3xl font-bold tracking-tight text-slate-950 md:text-4xl",
  sectionTitle: "text-xl font-bold tracking-tight text-slate-950",
  sectionTitleLg: "text-2xl font-bold tracking-tight text-slate-950",
  cardTitle: "text-lg font-bold text-slate-950",
  label: "text-sm font-medium text-slate-500",
  body: "text-sm leading-6 text-slate-600",
  bodyBase: "text-base leading-7 text-slate-600",
  muted: "text-sm text-slate-500",
  accent: "text-sm font-semibold text-cyan-700",
};

export const adminButtonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-cyan-100 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  primaryLg:
    "inline-flex items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm shadow-cyan-100 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  secondaryLg:
    "inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  subtle:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-cyan-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  danger:
    "inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-rose-100 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100",
  dangerOutline:
    "inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 no-underline transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100",
  success:
    "inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm shadow-emerald-100 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100",
  successOutline:
    "inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 no-underline transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100",

  primarySm:
    "inline-flex items-center justify-center rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white no-underline shadow-sm shadow-cyan-100 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  secondarySm:
    "inline-flex items-center justify-center rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 no-underline transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-100",
  dangerSm:
    "inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white no-underline shadow-sm shadow-rose-100 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100",
  dangerOutlineSm:
    "inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 no-underline transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100",
  successSm:
    "inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white no-underline shadow-sm shadow-emerald-100 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100",
};

export const adminNavStyles = {
  brand:
    "text-lg font-bold tracking-tight text-slate-950 no-underline transition hover:text-cyan-700",
  navGroup: "flex flex-wrap items-center gap-2 text-sm",
  navLink:
    "rounded-full px-3 py-1.5 font-medium text-slate-600 no-underline transition hover:bg-cyan-50 hover:text-cyan-700",
  navLinkActive:
    "rounded-full bg-cyan-600 px-3 py-1.5 font-semibold text-white no-underline shadow-sm shadow-cyan-100 transition hover:bg-cyan-700",
};

export const adminBadgeStyles = {
  base:
    "inline-flex items-center rounded-full border font-semibold tracking-tight",
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  blue: "border-cyan-200 bg-cyan-50 text-cyan-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export const adminFormStyles = {
  input:
    "mt-2 w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50",
  select:
    "mt-2 w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-50",
  label: "block",
  labelText: "text-sm font-medium text-slate-700",
};

export const adminInfoRowStyles = {
  base: "flex justify-between gap-4 border-b border-cyan-100 pb-3 last:border-b-0 last:pb-0",
  term: "text-slate-500",
  description: "font-semibold text-slate-950",
};

export const adminPillStyles = {
  neutral:
    "inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-sm text-slate-700",
  mock:
    "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
  mockLg:
    "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700",
};

export function getAdminHealthDotClass(isHealthy) {
  return isHealthy ? "bg-emerald-500" : "bg-rose-500";
}

export function getAdminHealthPillClass() {
  return "ml-auto flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-3 py-1 text-sm shadow-sm shadow-cyan-100/60";
}