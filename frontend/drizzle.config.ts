import { defineConfig } from "drizzle-kit"
import { env } from "~/env"

export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    schema: "./src/server/db/schema.ts",
})
