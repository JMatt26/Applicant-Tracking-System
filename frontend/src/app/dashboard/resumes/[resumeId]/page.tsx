import { currentUser } from "@clerk/nextjs/server"
import { getResumeByIdAndUser } from "~/services/ResumeService"

export default async function ResumePage({ params }: { params: { resumeId: string } }) {
    const user = await currentUser()

    if (!user) return

    const resume = await getResumeByIdAndUser(params.resumeId, user.id)

    if (!resume) return

    return (
        <div className="flex justify-center items-center h-svh">
            <iframe src={resume.fileUploadUrl} width="100%" height="100%" />
        </div>
    )
}
