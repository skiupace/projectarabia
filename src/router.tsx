import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Augment the Register interface to include Cloudflare context
declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: {
        cloudflare: {
          env: Env;
          ctx: ExecutionContext;
        };
      };
    };
  }
}

// Create a new router instance
export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
};
