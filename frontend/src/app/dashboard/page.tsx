import { SignedIn } from "@clerk/nextjs"
import Dashboard from "~/components/Dashboard"

export default function DashboardPage() {
    return (
        <SignedIn>
            <Dashboard />
        </SignedIn>
    )
}
