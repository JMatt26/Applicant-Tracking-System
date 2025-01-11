import { analysis } from "~/server/db/schema";
import { getLatestJobDescription } from "./JobDescriptionService"
import { getLatestResumeUpload } from "./ResumeService"
import { db } from "~/server/db/db"; // Adjust the import based on your project structure
import { InsertAnalysis } from "~/server/db/types";

export async function saveAnalysisResult(resumeId: string, analysisData: any): Promise<InsertAnalysis[] | null> {
    const result = await db
        .insert(analysis)
        .values({
            resumeId: resumeId,
            content: analysisData, 
        })
        .returning();

    if (!result) {
        return null;
    }

    return result;
} 

export async function analyzeLatestResumeAndJC(clerkId: string) {
    // Get the latest resume and job description from the services
    const latestResume = await getLatestResumeUpload(clerkId)
    const latestJob = await getLatestJobDescription(clerkId)

    if (!latestResume || !latestJob) {
        return { error: "No resume or job description found." }
    }

    const resumeUrl = latestResume.fileUploadUrl // Assuming the URL is stored in 'fileUploadUrl'
    const jobDescription = latestJob.content // Assuming the job description is stored in 'content'

    // Read the function app URL from the environment variable
    const functionAppUrl = process.env.ANALYZATION_SERVICE_URL

    try {
        // Send the resume URL to the process_resume_endpoint
        const processResumeResponse = await fetch(
            `${functionAppUrl}/process-resume?file=${encodeURIComponent(resumeUrl)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        if (!processResumeResponse.ok) {
            const errorData = await processResumeResponse.json()
            return errorData
        }

        // Get the parsed sections from the resume response
        const parsedResume = await processResumeResponse.json().then((data) => data.parsed_sections)

        // Send the parsed resume and job description to the percentage_match endpoint
        const percentageMatchResponse = await fetch(`${functionAppUrl}/match-resume-job`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                job_text: jobDescription,
                resume_text: parsedResume,
            }),
        })

        const analysisResult = await percentageMatchResponse.text();

        await saveAnalysisResult(latestResume.id, analysisResult); 

        return analysisResult;
    } catch (error) {
        console.error("Error during analysis:", error)
        return { error: "An error occurred during the analysis." }
    }
}
