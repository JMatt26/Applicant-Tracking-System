"use client"

import React, { useState } from "react"
import { Bell, Shield, User, Mail } from "lucide-react"
import ProfileModal, { ProfileData } from "./ProfileModal"

export const Settings: React.FC = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: "John Doe",
        email: "john.doe@example.com",
        title: "Software Engineer",
        bio: "Passionate about building great software and helping others succeed.",
    })

    const handleProfileSave = (data: ProfileData) => {
        setProfileData(data)
        // In a real app, you'd save this to your backend
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Profile Information</p>
                                    <p className="text-sm text-gray-500">Update your account profile details</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Email Preferences</p>
                                    <p className="text-sm text-gray-500">Manage your email notifications</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                                Update
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bell className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-sm text-gray-500">Receive updates about your resume analysis</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Privacy Settings</p>
                                    <p className="text-sm text-gray-500">Control how your data is used</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                                Configure
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Resume Analysis Preferences</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="keywords"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="keywords" className="ml-3 text-sm text-gray-700">
                                Include industry-specific keyword analysis
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="formatting"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="formatting" className="ml-3 text-sm text-gray-700">
                                Check resume formatting and structure
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="suggestions"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="suggestions" className="ml-3 text-sm text-gray-700">
                                Receive improvement suggestions
                            </label>
                        </div>
                    </div>
                </section>
            </div>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleProfileSave}
                initialData={profileData}
            />
        </main>
    )
}
