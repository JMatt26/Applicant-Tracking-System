"use server"

import { createUser } from "~/services/UserService"

export async function createUserAction(clerkId: string) {
    await createUser(clerkId)
}
