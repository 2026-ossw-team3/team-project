export const layoutStyles = {
  pageContainer: "mx-auto max-w-6xl px-6 py-10",
  sectionGap: "mt-8",
  gridCards: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
  gridStats: "grid gap-4 md:grid-cols-4",
  gridTwoColumns: "grid gap-4 md:grid-cols-2",
};

export const surfaceStyles = {
  appBackground: "min-h-screen bg-orange-50/40 text-slate-900",
  header:
    "sticky top-0 z-10 border-b border-orange-100 bg-white/90 shadow-sm shadow-orange-100/50 backdrop-blur",
  navContainer:
    "mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4",

  card:
    "rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-100/60",
  cardInteractive:
    "rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-100/60 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/80",
  mutedPanel:
    "rounded-2xl border border-orange-100 bg-orange-50/60 shadow-sm shadow-orange-100/60",
  sectionPanel:
    "rounded-2xl border border-orange-100 bg-white p-6 shadow-sm shadow-orange-100/60",
  heroPanel:
    "rounded-3xl border border-orange-100 bg-white p-8 shadow-sm shadow-orange-100/70",
  infoPanel:
    "rounded-2xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm shadow-amber-100/70",
  successPanel:
    "rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm shadow-green-100/70",
  warningPanel:
    "rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm shadow-amber-100/70",
  dangerPanel:
    "rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm shadow-red-100/70",
  emptyPanel:
    "rounded-2xl border border-orange-100 bg-white p-6 text-slate-600 shadow-sm shadow-orange-100/60",
  stepCard:
    "rounded-2xl border border-orange-100 bg-orange-50/50 p-4 transition duration-200 hover:border-orange-200 hover:bg-orange-50",
  ticketPanel:
    "rounded-3xl border border-orange-100 bg-orange-50/80 p-6 shadow-sm shadow-orange-100/70",
};

export const textStyles = {
  eyebrow:
    "mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600",
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
  accent: "text-sm font-semibold text-orange-600",
};

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-orange-100 transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100",
  primaryLg:
    "inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm shadow-orange-100 transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-100",
  secondaryLg:
    "inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-100",
  subtle:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-orange-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-orange-100",
  danger:
    "inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-red-200 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100",
  dangerOutline:
    "inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 no-underline transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100",
  success:
    "inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm shadow-green-100 transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100",
  successOutline:
    "inline-flex items-center justify-center rounded-xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-700 no-underline transition hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100",
};

export const navStyles = {
  brand:
    "text-lg font-bold tracking-tight text-slate-950 no-underline transition hover:text-orange-700",
  navGroup: "flex flex-wrap items-center gap-2 text-sm",
  navLink:
    "rounded-full px-3 py-1.5 font-medium text-slate-600 no-underline transition hover:bg-orange-50 hover:text-orange-700",
  navLinkActive:
    "rounded-full bg-orange-500 px-3 py-1.5 font-semibold text-white no-underline shadow-sm shadow-orange-100 transition hover:bg-orange-600",
};

export const badgeStyles = {
  base:
    "inline-flex items-center rounded-full border font-semibold tracking-tight",
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  neutral: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-orange-200 bg-orange-50 text-orange-700",
  green: "border-green-200 bg-green-50 text-green-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export const formStyles = {
  input:
    "mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-orange-50",
  select:
    "mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-orange-50",
  label: "block",
  labelText: "text-sm font-medium text-slate-700",
};

export const infoRowStyles = {
  base: "flex justify-between gap-4 border-b border-orange-100 pb-3 last:border-b-0 last:pb-0",
  term: "text-slate-500",
  description: "font-semibold text-slate-950",
};

export const pillStyles = {
  neutral:
    "inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm text-slate-700",
  mock:
    "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
  mockLg:
    "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700",
};

export function getHealthDotClass(isHealthy) {
  return isHealthy ? "bg-green-500" : "bg-red-500";
}

export function getHealthPillClass() {
  return "ml-auto flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1 text-sm shadow-sm shadow-orange-100/60";
}