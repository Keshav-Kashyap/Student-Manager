const StudentTableSkeleton = () => {
    const rows = Array(6).fill(null);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="h-5 w-28 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-36 bg-gray-200 rounded-md animate-pulse" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Checkbox */}
                            <th className="px-6 py-4 text-left">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                            </th>
                            {/* Column Headers */}
                            {[36, 40, 100, 90, 90, 40, 40, 72, 60, 55].map((w, i) => (
                                <th key={i} className="px-6 py-4 text-left">
                                    <div
                                        className="h-3 bg-gray-200 rounded animate-pulse"
                                        style={{ width: `${w}px` }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {rows.map((_, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50">
                                {/* Checkbox */}
                                <td className="px-6 py-4">
                                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                </td>

                                {/* S.No */}
                                <td className="px-6 py-4">
                                    <div className="h-4 w-6 bg-gray-200 rounded animate-pulse" />
                                </td>

                                {/* Photo */}
                                <td className="px-6 py-4">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                                </td>

                                {/* Student Name */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                        <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                                    </div>
                                </td>

                                {/* Father's Name */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                                </td>

                                {/* Mother's Name */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                                </td>

                                {/* Class */}
                                <td className="px-6 py-4">
                                    <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
                                </td>

                                {/* DOB */}
                                <td className="px-6 py-4">
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                </td>

                                {/* Mobile */}
                                <td className="px-6 py-4">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                </td>

                                {/* Address */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                    <div className="flex items-center gap-2">
                        {Array(5).fill(null).map((_, i) => (
                            <div key={i} className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentTableSkeleton;