import React from "react"
import PreviousUploads from "./PreviousUploads"
import ResumeUploader from "./ResumeUploader"
import JobDescription from "./JobDescription"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getPreviousUploadsForUser } from "~/services/ResumeService"
import AnalyzeButton from "./AnalyzeButton"

export default async function Dashboard() {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    const uploads = await getPreviousUploadsForUser(user.id)

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-8">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Resume</h2>
                        <ResumeUploader />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <JobDescription />
                    </div>
                </section>
                <div className="flex justify-center">
                    <AnalyzeButton />
                </div>

                {uploads && <PreviousUploads uploads={uploads} />}
            </div>
        </main>
    )
}
