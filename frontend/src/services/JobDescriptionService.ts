import { db } from "~/server/db/db"
import { jobDescriptions } from "~/server/db/schema"
import { InsertJobDescription } from "~/server/db/types"
import { desc, eq } from "drizzle-orm"

export async function uploadUserJobDescription(
    content: string,
    clerkId: string
): Promise<InsertJobDescription[] | null> {
    const uploadedJobDescription = await db
        .insert(jobDescriptions)
        .values({
            clerkUserId: clerkId,
            content,
        })
        .returning()

    if (!uploadedJobDescription) {
        return null
    }

    return uploadedJobDescription
}

export async function getLatestJobDescription(clerkId: string): Promise<InsertJobDescription | null> {
    const latestJobDescription = await db.query.jobDescriptions.findFirst({
        where: eq(jobDescriptions.clerkUserId, clerkId),
        orderBy: [desc(jobDescriptions.createdAt)],
    })

    if (!latestJobDescription) {
        return null
    }

    return latestJobDescription
}
