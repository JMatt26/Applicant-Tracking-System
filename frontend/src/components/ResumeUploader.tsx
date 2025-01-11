"use client"

import { OurFileRouter } from "~/app/api/uploadthing/core"
import { generateUploadDropzone } from "@uploadthing/react"
import { toast } from "sonner"

export default function ResumeUploader() {
    const UploadDropzone = generateUploadDropzone<OurFileRouter>()

    return (
        <UploadDropzone
            endpoint="resumeUploader"
            appearance={{
                label: "text-[18px] mb-2",
                allowedContent: "text-[18px]",
                uploadIcon: "mx-auto h-12 w-12 text-gray-400",
                container: ({ isDragActive }) =>
                    isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
            }}
            content={{
                label: ({ isDragActive }) => (isDragActive ? "Drop your resume here" : "Drag & drop your resume here"),
                allowedContent: () => `or click to select a file (PDF, DOC, DOCX)`,
            }}
            onClientUploadComplete={() => {
                // TODO: error handling
                toast("Resume uploaded successfully!")
            }}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
        />
    )
}
