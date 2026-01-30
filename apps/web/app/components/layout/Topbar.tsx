'use client';
import { useAuth } from '@/app/context/AuthContext';
import { User as UserIcon } from 'lucide-react';

export default function Topbar() {
    const { user } = useAuth();

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {/* Avatar or Initials */}
                    <UserIcon size={20} />
                </div>
            </div>
        </div>
    );
}
