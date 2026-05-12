export const surfaceStyles = {
  appBackground: "min-h-screen bg-slate-50 text-slate-900",
  header:
    "sticky top-0 z-10 border-b border-slate-200 bg-white/90 shadow-sm shadow-slate-200/40 backdrop-blur",
  navContainer:
    "mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4",
  card:
    "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70",
  cardInteractive:
    "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-slate-200/80",
  mutedPanel:
    "rounded-2xl border border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/50",
  sectionPanel:
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70",
};

export const textStyles = {
  pageTitle: "text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl",
  sectionTitle: "text-xl font-bold tracking-tight text-slate-950",
  cardTitle: "text-lg font-bold text-slate-950",
  label: "text-sm font-medium text-slate-500",
  body: "text-sm leading-6 text-slate-600",
  muted: "text-sm text-slate-500",
  accent: "text-sm font-semibold text-blue-600",
};

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-blue-100 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100",
  subtle:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100",
  danger:
    "inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm shadow-red-200 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100",
};

export const navStyles = {
  brand:
    "text-lg font-bold tracking-tight text-slate-950 no-underline transition hover:text-blue-700",
  navGroup: "flex flex-wrap items-center gap-2 text-sm",
  navLink:
    "rounded-full px-3 py-1.5 font-medium text-slate-600 no-underline transition hover:bg-blue-50 hover:text-blue-700",
  navLinkActive:
    "rounded-full bg-blue-500 px-3 py-1.5 font-semibold text-white no-underline shadow-sm shadow-blue-100 transition hover:bg-blue-600",
};

export const badgeStyles = {
  base:
    "inline-flex items-center rounded-full border font-semibold tracking-tight",
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-green-200 bg-green-50 text-green-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export const formStyles = {
  select:
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100",
};

export function getHealthDotClass(isHealthy) {
  return isHealthy ? "bg-green-500" : "bg-red-500";
}

export function getHealthPillClass() {
  return "ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm shadow-slate-200/50";
}