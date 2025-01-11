import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createUser, findUserByClerkId } from "~/services/UserService"

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        // TODO: add notif
        redirect("/")
    }

    try {
        if (!(await findUserByClerkId(userId))) {
            const createdUser = await createUser(userId)

            if (!createdUser) {
                // TODO: add notif
                redirect("/")
            }
        }
    } catch (err) {
        console.error(err)
        redirect("/")
    } finally {
        // TODO: log them out
    }

    redirect("/dashboard")
}
