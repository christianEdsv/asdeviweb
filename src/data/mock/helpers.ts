import type { ArbitraryTypedObject } from "@portabletext/types";
import type { CmsImage } from "@/types/content";

/** Utilidades para construir datos de prueba tipados. */

let keyCounter = 0;
const nextKey = (): string => `mock-${(keyCounter += 1)}`;

export function mockImage(file: string, alt: string, width = 1200, height = 675): CmsImage {
  return { mockSrc: `/mock/${file}`, alt, width, height };
}

export const cover = (n: number, alt: string): CmsImage =>
  mockImage(`cover-${n}.svg`, alt, 1200, 675);
export const logo = (n: number, alt: string): CmsImage =>
  mockImage(`logo-${n}.svg`, alt, 400, 400);
export const avatar = (n: number, alt: string): CmsImage =>
  mockImage(`avatar-${n}.svg`, alt, 400, 400);

type BlockStyle = "normal" | "h2" | "h3" | "blockquote";

export function block(text: string, style: BlockStyle = "normal"): ArbitraryTypedObject {
  return {
    _type: "block",
    _key: nextKey(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}

export function bullets(items: string[]): ArbitraryTypedObject[] {
  return items.map((text) => ({
    _type: "block",
    _key: nextKey(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  }));
}

export function imageBlock(image: CmsImage): ArbitraryTypedObject {
  return { _type: "image", _key: nextKey(), ...image };
}

export function youtubeBlock(url: string, title: string): ArbitraryTypedObject {
  return { _type: "youtube", _key: nextKey(), url, title };
}

const DAY_MS = 86_400_000;

/**
 * Fecha ISO relativa al momento de carga del módulo, a las `hour`:00 UTC.
 * Mantiene siempre "próximos" y "pasados" en los datos de prueba.
 */
export function daysFromNow(days: number, hour = 18): string {
  const date = new Date(Date.now() + days * DAY_MS);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}
