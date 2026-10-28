import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./documents/author";
import { eventType } from "./documents/event";
import { memberType } from "./documents/member";
import { postType } from "./documents/post";
import { siteSettingsType } from "./documents/siteSettings";
import { blockContentType, postBodyType } from "./objects/blockContent";
import { externalLinkType } from "./objects/externalLink";
import { seoType } from "./objects/seo";
import { youtubeType } from "./objects/youtube";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Colecciones
  memberType,
  eventType,
  postType,
  authorType,
  // Singleton
  siteSettingsType,
  // Objetos reutilizables
  seoType,
  externalLinkType,
  youtubeType,
  blockContentType,
  postBodyType,
];

/** Tipos que solo pueden existir una vez (sin crear/duplicar/eliminar). */
export const singletonTypes = new Set(["siteSettings"]);
