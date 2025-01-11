"use client"

import { FileText, Calendar, Trash2, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SelectResume } from "~/server/db/types"
import { deleteResumeAction } from "~/actions/ResumeActions"
import { toast } from "sonner"
import Link from "next/link"

export default function PreviousUploads({ uploads }: { uploads: SelectResume[] }) {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Previous Uploads</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {!uploads || uploads.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No previous uploads found</div>
                ) : (
                    uploads.map((upload) => (
                        <div key={upload.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <Link href={`/dashboard/resumes/${upload.id}`} className="flex items-start space-x-3">
                                    <FileText className="h-5 w-5 text-blue-500 mt-1" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{upload.fileName}</h3>
                                        {/* {upload.jobTitle && ( */}
                                        {/*     <p className="text-sm text-gray-500 mt-1">Applied for: {upload.jobTitle}</p> */}
                                        {/* )} */}
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDistanceToNow(upload.createdAt, { addSuffix: true })}
                                            </span>
                                            {/* @ts-ignore */}
                                            {upload.analysis && upload.analysis.content && (
                                                <span className="flex items-center text-sm text-gray-500">
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    Match Score: {/* @ts-ignore */}
                                                    {upload.analysis.content.match(/(\d+[-]\d+)%/)[1]}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={async () => {
                                            await deleteResumeAction(upload.id)
                                            // TODO: error handling
                                            toast("Resume deleted successfully!")
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
