import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default process.env.NODE_ENV === "production"
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
				url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/e7b3435c5682e58442b380529a7382fade69fb3034c763824544122e980c535b.sqlite",
			},
		});
