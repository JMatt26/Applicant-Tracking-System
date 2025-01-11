"use server"

import { revalidatePath } from "next/cache"
import { uploadUserJobDescription } from "~/services/JobDescriptionService"

export async function uploadJobDescriptionAction(content: string, clerkId: string) {
    const uploadedJobDescription = await uploadUserJobDescription(content, clerkId)
    revalidatePath("/dashboard")
}
