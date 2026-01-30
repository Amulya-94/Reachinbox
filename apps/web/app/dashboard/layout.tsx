'use client';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useState } from 'react';
import ComposeModal from '../components/ComposeModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar onCompose={() => setIsComposeOpen(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
            {isComposeOpen && <ComposeModal onClose={() => setIsComposeOpen(false)} />}
        </div>
    );
}
