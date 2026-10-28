"use client";

/**
 * Configuración del Sanity Studio embebido en `/studio`.
 * La autenticación la gestiona Sanity (OAuth): no hay usuarios locales.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";
import { schemaTypes, singletonTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  name: "asdevi",
  title: "ASDEVI · Panel de contenido",
  basePath: studioBasePath,
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  schema: {
    types: schemaTypes,
    // El singleton no aparece en el menú «Crear nuevo».
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // El singleton no puede duplicarse ni eliminarse.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action && !["unpublish", "delete", "duplicate"].includes(action),
          )
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
