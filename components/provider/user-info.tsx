import { Calendar, Settings2 } from 'lucide-react';
import React, { useState } from 'react'

export const UserInfo = ({ user }) => {
    return (
        <>
            <header className=" py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/dashboard/profile/">
                        <span className="w-15 h-15 rounded-full bg-[#22252A]  flex items-center justify-center text-white text-m">
                            {user?.display_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'U'}
                        </span>
                    </a>
                    <div>
                        <h1 className="text-xl font-semibold text-white">Hello, {user?.display_name || user?.email || 'User'}!</h1>
                        <p className="text-sm text-muted-foreground text-white-200">Manage your bookings and invoices</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/provider/calendar">
                        <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-m border border-[#ABB0BA80] hover:border-blue-600 hover:bg-blue-600 transition-all duration-200">
                            <Calendar size={20}/>
                        </span>
                    </a>
                    <a href="/settings">
                        <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-m border border-[#ABB0BA80] hover:border-blue-600 hover:bg-blue-600 transition-all duration-200">
                            <Settings2 size={20} />
                        </span>
                    </a>
                </div>

            </header>
        </>
    );
}
export default UserInfo;