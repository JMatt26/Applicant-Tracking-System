"use server"

import { revalidatePath } from "next/cache"
import { SelectResume } from "~/server/db/types"
import { deleteUserResume, getPreviousUploadsForUser, uploadUserResume } from "~/services/ResumeService"

export async function createResumeAction(fileName: string, clerkId: string) {
    await uploadUserResume(fileName, clerkId)

    revalidatePath("/dashboard")
}

export async function deleteResumeAction(resumeId: string) {
    await deleteUserResume(resumeId)

    revalidatePath("/dashboard")
}
