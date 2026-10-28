import { siteConfig } from "@/config/site";

const dateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: siteConfig.timeZone,
});

const shortDateFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: "numeric",
  month: "short",
  timeZone: siteConfig.timeZone,
});

const timeFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: siteConfig.timeZone,
});

const monthFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  month: "short",
  timeZone: siteConfig.timeZone,
});

const dayFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: "2-digit",
  timeZone: siteConfig.timeZone,
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: siteConfig.timeZone,
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function getMonthLabel(iso: string): string {
  return monthFormatter.format(new Date(iso)).replace(".", "").toUpperCase();
}

export function getDayLabel(iso: string): string {
  return dayFormatter.format(new Date(iso));
}

/** Clave `YYYY-MM-DD` del día en la zona horaria del sitio. */
function dayKey(iso: string): string {
  return dayKeyFormatter.format(new Date(iso));
}

/** Rango legible: "12 de marzo de 2026" o "12 de marzo – 14 de marzo de 2026". */
export function formatDateRange(startIso: string, endIso?: string): string {
  if (!endIso || dayKey(startIso) === dayKey(endIso)) {
    return formatDate(startIso);
  }
  return `${formatShortDate(startIso)} – ${formatDate(endIso)}`;
}

export type EventStatus = "upcoming" | "ongoing" | "past";

/** Determina si un evento es próximo, está en curso o ya pasó. */
export function getEventStatus(
  startIso: string,
  endIso: string | undefined,
  now: Date = new Date(),
): EventStatus {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso ?? startIso).getTime();
  const current = now.getTime();
  if (current < start) return "upcoming";
  if (current <= end) return "ongoing";
  return "past";
}
