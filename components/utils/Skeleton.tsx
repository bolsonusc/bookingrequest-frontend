import React from 'react';

function Skeleton() {
    return (
        <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-gray-700 rounded"></div>
                    <div className="h-3 w-24 bg-gray-600 rounded"></div>
                </div>
                <div className="h-3 w-12 bg-gray-700 rounded"></div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                    <div className="h-3 w-16 bg-gray-600 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export { Skeleton };