'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

interface EmailJob {
    id: string;
    to: string;
    subject: string;
    sentAt: string;
    status: string;
}

export default function SentPage() {
    const [jobs, setJobs] = useState<EmailJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/sent');
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                Sent Emails
            </h1>

            {jobs.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                    No sent emails found.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Recipient</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Subject</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Sent At</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{job.to}</td>
                                    <td className="px-6 py-4 text-gray-600">{job.subject}</td>
                                    <td className="px-6 py-4">{format(new Date(job.sentAt), 'PPp')}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
