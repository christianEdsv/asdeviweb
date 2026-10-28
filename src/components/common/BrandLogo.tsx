import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

/**
 * Emblema oficial de ASDEVI (Control + Torogoz) adaptado a la paleta del sitio:
 * - Modo Claro: silueta en Azul Marino (#000080) / Azul Federal (#000053) con
 *   botones de acción en Dorado (#FFD500) y Amarillo Mikado (#FDC500).
 * - Modo Oscuro: silueta en Blanco Hielo (#F5F8FC) con cruceta y botones en
 *   Dorado (#FFD500) y Amarillo Mikado (#FDC500).
 */
export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center select-none",
        className,
      )}
    >
      <Image
        src="/logo-light.png"
        alt={`Logo de ${siteConfig.name}`}
        width={1024}
        height={850}
        priority={priority}
        className="logo-light-img h-full w-auto object-contain"
      />
      <Image
        src="/logo-dark.png"
        alt={`Logo de ${siteConfig.name}`}
        width={1024}
        height={850}
        priority={priority}
        className="logo-dark-img h-full w-auto object-contain"
      />
    </span>
  );
}
