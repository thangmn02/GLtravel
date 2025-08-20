// File: src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MAPBOX_ACCESS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
