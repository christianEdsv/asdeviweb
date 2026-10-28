// @ts-check
const isDev = process.env.NODE_ENV !== "production";
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * Cabeceras de seguridad aplicadas a TODAS las rutas (sitio público + Studio).
 * @type {{ key: string; value: string }[]}
 */
const baseSecurityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

/**
 * CSP del sitio público. Las páginas se generan estáticamente (SSG/ISR), por lo
 * que no es posible usar nonces por petición: se permiten scripts inline de
 * hidratación de Next.js, pero se bloquea cualquier origen externo de scripts,
 * objetos, formularios y encuadres.
 */
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self' https://cdn.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: sanityProjectId ? `/images/${sanityProjectId}/**` : "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Sitio público: todo excepto /studio
        source: "/((?!studio).*)",
        headers: [
          ...baseSecurityHeaders,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: siteCsp },
        ],
      },
      {
        // Sanity Studio: necesita su propio origen, workers y websockets;
        // se mantiene protegido contra clickjacking externo.
        source: "/studio/:path*",
        headers: [
          ...baseSecurityHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
