import { useState } from "react";

const SkeletonBox = ({ className = "" }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] rounded-lg ${className}`}
        style={{
            animation: "shimmer 1.4s infinite linear",
            backgroundSize: "400% 100%",
        }}
    />
);

export default function ProfileSkeleton() {
    const [activeTab, setActiveTab] = useState("personal");

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 400% 100%;
          animation: shimmer 1.4s infinite linear;
        }
      `}</style>

            <div className="h-full w-full p-6 rounded-xl bg-blue-50 overflow-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white mb-[50px] rounded-2xl shadow-xl p-8">

                        {/* Avatar + Name + Email */}
                        <div className="flex flex-col items-center gap-3 mb-8">
                            <div className="w-20 h-20 rounded-full shimmer" />
                            <div className="shimmer h-4 w-24 rounded-full" />
                            <div className="shimmer h-3 w-44 rounded-full" />
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-center gap-2 mb-8">
                            {["personal", "security"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize border
                  ${activeTab === tab
                                            ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {tab === "personal" ? "Personal Info" : "Security"}
                                </button>
                            ))}
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {/* Full Name */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-20 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-24 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-28 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* College */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-36 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* Department */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-24 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* Designation */}
                            <div className="flex flex-col gap-2">
                                <div className="shimmer h-3 w-32 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>

                            {/* Address - Full Width */}
                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <div className="shimmer h-3 w-16 rounded" />
                                <div className="shimmer h-20 w-full rounded-lg" />
                            </div>

                            {/* Emergency Contact - Full Width */}
                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <div className="shimmer h-3 w-36 rounded" />
                                <div className="shimmer h-10 w-full rounded-lg" />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end mt-8">
                            <div className="shimmer h-10 w-36 rounded-lg" />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}