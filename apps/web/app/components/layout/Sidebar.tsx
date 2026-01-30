'use client';
import { Home, Send, Mail, LogOut, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Sidebar({ onCompose }: { onCompose: () => void }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: 'Scheduled', href: '/dashboard', icon: Home },
        { name: 'Sent', href: '/dashboard/sent', icon: Send },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 border-r border-gray-800 text-white flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">ReachInbox</span>
            </div>

            <div className="p-4">
                <button
                    onClick={onCompose}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors mb-6"
                >
                    <PlusCircle size={20} />
                    Compose
                </button>

                <nav className="flex flex-col gap-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg w-full transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
