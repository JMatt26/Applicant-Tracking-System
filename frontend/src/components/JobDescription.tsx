"use client"

import React, { ClipboardEvent } from "react"
import { Briefcase } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { uploadJobDescriptionAction } from "~/actions/JobDescriptionActions"
import { toast } from "sonner"

export default function JobDescription() {
    const user = useUser()

    if (!user.user) {
        return null
    }

    return (
        <div className="relative">
            <div className="flex items-center space-x-2 mb-3">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900">Job Description</h3>
            </div>
            <textarea
                onPaste={async (e: ClipboardEvent<HTMLTextAreaElement>) => {
                    if (e.clipboardData) {
                        const clipboardData = e.clipboardData.getData("text")
                        await uploadJobDescriptionAction(clipboardData, user.user.id)
                        // TODO: error handling
                        toast("Job description uploaded successfully!")
                    }
                }}
                placeholder="Paste the job description here to compare with your resume..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <p className="mt-2 text-sm text-gray-500">
                Adding a job description helps us analyze how well your resume matches the position requirements.
            </p>
        </div>
    )
}
