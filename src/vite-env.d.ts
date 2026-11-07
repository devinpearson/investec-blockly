/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Address of investec-card-server. Defaults to http://localhost:3010. */
  readonly VITE_SIMULATOR_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
