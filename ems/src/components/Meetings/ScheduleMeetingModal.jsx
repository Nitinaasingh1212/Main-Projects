import React, { useState, useEffect } from 'react';
import { createMeeting } from '../../firebase/firestoreService';

const ScheduleMeetingModal = ({ onClose, currentUser, employees = [], onCreated, prefilledAttendee }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('11:00');
    const [duration, setDuration] = useState('30 mins');
    const [meetUrl, setMeetUrl] = useState('');
    const [agenda, setAgenda] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedAttendees, setSelectedAttendees] = useState(prefilledAttendee ? [prefilledAttendee] : ['All']);
    const [status, setStatus] = useState('scheduled');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateGoogleMeetLink = () => {
        const randStr = (len) => Math.random().toString(36).substring(2, 2 + len);
        const code = `xyz-${randStr(3)}-${randStr(3)}`;
        setMeetUrl(`https://meet.google.com/${code}`);
    };

    useEffect(() => {
        generateGoogleMeetLink();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const meetingData = {
            title: title.trim() || `Team Sync with ${currentUser?.firstName || 'Lead'}`,
            date,
            time,
            duration,
            meetUrl,
            meetCode: meetUrl.split('/').pop() || 'meet-code',
            agenda: agenda.trim() || 'General operations sync and task review.',
            hostName: currentUser?.firstName || 'Nitin',
            attendees: selectedAttendees,
            department: selectedDepartment,
            status
        };

        try {
            await createMeeting(meetingData);
            if (onCreated) onCreated();
            onClose();
        } catch (err) {
            console.error('Error creating meeting:', err);
            alert(err.message || 'Failed to schedule meeting.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Schedule Live Meeting</h3>
                        <p className="text-xs text-slate-400">Generate Google Meet link and broadcast to team</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Meeting Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Sprint Review & Architecture Alignment"
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                            <input
                                required
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Duration</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none bg-white"
                            >
                                <option value="15 mins">15 mins</option>
                                <option value="30 mins">30 mins</option>
                                <option value="45 mins">45 mins</option>
                                <option value="60 mins">60 mins</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-slate-600">Google Meet Link</label>
                            <button
                                type="button"
                                onClick={generateGoogleMeetLink}
                                className="text-[11px] text-[#0084ff] hover:underline"
                            >
                                Regenerate Code
                            </button>
                        </div>
                        <input
                            type="url"
                            value={meetUrl}
                            onChange={(e) => setMeetUrl(e.target.value)}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Agenda & Description</label>
                        <textarea
                            rows={3}
                            value={agenda}
                            onChange={(e) => setAgenda(e.target.value)}
                            placeholder="Key discussion points, sprint targets, deliverables..."
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Meeting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingModal;
