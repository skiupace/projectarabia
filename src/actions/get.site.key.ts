import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getSiteKeyFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return env.VITE_SITE_KEY;
  },
);
