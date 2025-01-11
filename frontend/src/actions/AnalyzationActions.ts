"use server"

import { revalidatePath } from "next/cache"
import { analyzeLatestResumeAndJC } from "~/services/AnalyzationService"

export async function analyzeLatestResumeAndJCAction(clerkUserId: string) {
    const analysis = await analyzeLatestResumeAndJC(clerkUserId)
    console.log(analysis)
    revalidatePath("/dashboard")
}
