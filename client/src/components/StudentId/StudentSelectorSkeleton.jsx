const StudentSelectorSkeleton = () => (
    <div className="print:hidden bg-white shadow-sm rounded-b-lg border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-lg">

                {/* Top row — select all + count */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-52 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Checkbox grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                    {Array(4).fill(null).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2">
                            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                            <div
                                className="h-3 bg-gray-200 rounded animate-pulse"
                                style={{ width: `${60 + (i * 13) % 40}%` }}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </div>
);

export default StudentSelectorSkeleton;