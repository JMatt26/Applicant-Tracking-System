"use client"

import { analyzeLatestResumeAndJCAction } from "~/actions/AnalyzationActions"
import { Button } from "./ui/button"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function AnalyzeButton() {
    const [analyzing, setAnalyzing] = useState(false)

    const user = useUser()

    if (!user || !user.user) return

    return (
        <Button
            onClick={async () => {
                setAnalyzing(true)
                await analyzeLatestResumeAndJCAction(user.user.id)
                setAnalyzing(false)
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
            {!analyzing ? "Analyze Resume" : "Analyzing..."}
        </Button>
    )
}
