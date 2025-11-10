import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default process.env.CLOUDFLARE_ENV === "production"
	? defineConfig({
			dialect: "sqlite",
			driver: "d1-http",
			out: "drizzle",
			schema: "src/schemas/db/schema.ts",
			dbCredentials: {
				accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
				databaseId: process.env.CLOUDFLARE_DATABASE_ID,
				token: process.env.CLOUDFLARE_D1_TOKEN!,
			},
		})
	: defineConfig({
			dialect: "sqlite",
			out: "drizzle",
			schema: "src/schemas/db/schema.ts",
			dbCredentials: {
				url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/b2f2ab0d4f45f97f21f9f087e79b83ee7bc4bd433f50bca3610754da6612b17f.sqlite",
			},
		});
