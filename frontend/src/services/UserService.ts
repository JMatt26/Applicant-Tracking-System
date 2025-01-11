import { eq } from "drizzle-orm"
import { db } from "~/server/db/db"
import { users } from "~/server/db/schema"
import { InsertUser, SelectUser } from "~/server/db/types"

export async function createUser(clerk_id: string): Promise<InsertUser[] | null> {
    const dbUser = await db.insert(users).values({ clerkId: clerk_id }).returning()
    if (dbUser) {
        return dbUser
    }

    return null
}

export async function findUserByClerkId(clerk_id: string): Promise<SelectUser | null> {
    const dbUser = await db.query.users.findFirst({ where: eq(users.clerkId, clerk_id) })

    if (dbUser) {
        return dbUser
    }

    return null
}
