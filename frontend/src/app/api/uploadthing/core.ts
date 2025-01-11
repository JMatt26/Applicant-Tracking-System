import { currentUser } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { uploadUserResume } from "~/services/ResumeService"

const f = createUploadthing()

export const ourFileRouter = {
    resumeUploader: f({
        pdf: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
        "application/pdf": {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
        "application/msword": {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await currentUser()

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized")

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await uploadUserResume(file.name, file.appUrl, metadata.userId)

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
