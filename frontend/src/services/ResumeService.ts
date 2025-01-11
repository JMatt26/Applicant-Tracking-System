import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/server/db/db"
import { resumes } from "~/server/db/schema"
import { InsertResume, SelectResume } from "~/server/db/types"
import { utapi } from "~/server/uploadthing"

export async function uploadUserResume(
    fileName: string,
    fileUrl: string,
    clerkId: string
): Promise<InsertResume[] | null> {
    const uploadedResume = await db
        .insert(resumes)
        .values({
            fileUploadUrl: fileUrl,
            fileName: fileName,
            clerkUserId: clerkId,
        })
        .returning()

    if (!uploadedResume) {
        return null
    }

    revalidatePath("/dashboard")

    return uploadedResume
}

export async function getLatestResumeUpload(clerkId: string): Promise<SelectResume | null> {
    const latestResume = await db.query.resumes.findFirst({
        where: eq(resumes.clerkUserId, clerkId),
        orderBy: [desc(resumes.createdAt)],
    })

    if (!latestResume) {
        return null
    }

    return latestResume
}

export async function deleteUserResume(resumeId: string): Promise<InsertResume[] | null> {
    const deletedResume = await db.delete(resumes).where(eq(resumes.id, resumeId)).returning()

    if (deletedResume[0]) {
        const utFileId = deletedResume[0].fileUploadUrl.split("/").pop()

        if (utFileId) {
            const { success } = await utapi.deleteFiles(utFileId)

            if (!success) {
                console.error(`Failed to delete file ${utFileId} from uploadthing`)
            }
        }
    }

    return deletedResume
}

export async function getPreviousUploadsForUser(clerkId: string): Promise<SelectResume[] | null> {
    const uploadedResumes = await db.query.resumes.findMany({
        where: eq(resumes.clerkUserId, clerkId),
        with: { analysis: true },
    })

    if (!uploadedResumes) {
        return null
    }

    return uploadedResumes
}

export async function getResumeByIdAndUser(resumeId: string, clerkId: string): Promise<SelectResume | null> {
    const resume = await db.query.resumes.findFirst({
        where: and(eq(resumes.id, resumeId), eq(resumes.clerkUserId, clerkId)),
    })

    if (!resume) {
        return null
    }

    return resume
}
