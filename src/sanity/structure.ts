import {
  CalendarIcon,
  Settings as CogIcon,
  FileText as DocumentTextIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";

/** Organización del panel: ajustes (singleton) + colecciones. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Ajustes del sitio")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Ajustes del sitio"),
        ),
      S.divider(),
      S.documentTypeListItem("member").title("Miembros").icon(UserIcon),
      S.documentTypeListItem("event").title("Eventos").icon(CalendarIcon),
      S.documentTypeListItem("post").title("Noticias").icon(DocumentTextIcon),
      S.divider(),
      S.documentTypeListItem("author").title("Autores").icon(UsersIcon),
    ]);
