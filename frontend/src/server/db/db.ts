import { db as neonDB } from "./db.prod"
import { db as postgresDB } from "./db.dev"
import { env } from "~/env"

export let db: typeof neonDB | typeof postgresDB

if (env.NODE_ENV === "production") {
    db = neonDB
} else {
    db = postgresDB
}
