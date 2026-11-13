import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiRouteDir = path.join(root, "src", "app", "api", "revalidate");
const backupDir = path.join(root, ".revalidate-route-backup");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const HEADERS_CONTENT = `/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  X-DNS-Prefetch-Control: on
  Cross-Origin-Opener-Policy: same-origin-allow-popups

/studio/*
  X-Frame-Options: SAMEORIGIN
  X-Robots-Tag: noindex, nofollow
`;

let moved = false;

try {
  if (fs.existsSync(apiRouteDir)) {
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    fs.renameSync(apiRouteDir, backupDir);
    moved = true;
  }

  // Limpiar tipos generados por `next dev` para evitar referencias a la ruta temporalmente movida
  for (const typesDir of [
    path.join(root, ".next", "types"),
    path.join(root, ".next", "dev", "types"),
  ]) {
    if (fs.existsSync(typesDir)) {
      fs.rmSync(typesDir, { recursive: true, force: true });
    }
  }

  const result = spawnSync(process.execPath, [nextBin, "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "true",
    },
  });

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else {
    const outDir = path.join(root, "out");
    if (fs.existsSync(outDir)) {
      fs.writeFileSync(path.join(outDir, "_headers"), HEADERS_CONTENT, "utf8");
    }
  }
} finally {
  if (moved && fs.existsSync(backupDir)) {
    fs.mkdirSync(path.dirname(apiRouteDir), { recursive: true });
    fs.renameSync(backupDir, apiRouteDir);
  }
}
