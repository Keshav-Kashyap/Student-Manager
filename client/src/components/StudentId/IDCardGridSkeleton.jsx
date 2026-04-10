const IDCardSkeleton = () => (
    <div className="relative bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full max-w-sm">

        {/* Photo + Name Row */}
        <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
            {['w-20', 'w-28', 'w-16', 'w-24'].map((w, i) => (
                <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                    <div className={`h-4 ${w} bg-gray-200 rounded animate-pulse`} />
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="h-3 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        </div>
    </div>
);

const IDCardGridSkeleton = ({ layout = '3x2', count = 6 }) => {
    const getGridClass = () => {
        switch (layout) {
            case '2x2': return 'grid-cols-1 sm:grid-cols-2';
            case '3x2': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            case '4x2': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            default: return 'grid-cols-1 sm:grid-cols-2';
        }
    };

    return (
        <div className={`grid gap-4 p-11  sm:gap-6 ${getGridClass()} justify-items-center`}>
            {Array(count).fill(null).map((_, i) => (
                <div key={i} className="w-full max-w-lg">
                    <IDCardSkeleton />
                </div>
            ))}
        </div>
    );
};

export default IDCardGridSkeleton;