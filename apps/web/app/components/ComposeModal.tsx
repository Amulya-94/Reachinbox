'use client';
import { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface ComposeModalProps {
    onClose: () => void;
}

export default function ComposeModal({ onClose }: ComposeModalProps) {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [emails, setEmails] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [delay, setDelay] = useState('');
    const [hourlyLimit, setHourlyLimit] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // Simple regex to extract emails
            const extracted = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
            // De-duplicate
            const unique = Array.from(new Set(extracted));
            setEmails(unique);
        };
        reader.readAsText(file);
    };

    const handleSchedule = async () => {
        if (!user || loading) return;
        setLoading(true);
        try {
            await api.post('/schedule', {
                userId: user.id,
                emails,
                subject,
                body,
                startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
                delaySeconds: delay,
                hourlyLimit: hourlyLimit
            });
            alert('Emails Scheduled Successfully!');
            onClose();
            // In a real app, trigger a refresh of the list
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to schedule emails');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Compose New Campaign</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your email content..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipients (CSV/Text)</label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 relative">
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="text-gray-400 mb-2" size={24} />
                                <span className="text-sm text-gray-500">Click to upload recipients</span>
                            </div>
                            {emails.length > 0 && (
                                <p className="text-sm text-green-600 mt-2 font-medium">{emails.length} emails detected</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none pl-10"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Leave empty to send immediately</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 5"
                                value={delay}
                                onChange={(e) => setDelay(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Limit</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 50"
                                value={hourlyLimit}
                                onChange={(e) => setHourlyLimit(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button
                        onClick={handleSchedule}
                        disabled={loading || emails.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Scheduling...' : 'Schedule Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );
}
