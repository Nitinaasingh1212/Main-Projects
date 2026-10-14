import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import {
    subscribeToMeetings,
    deleteMeeting,
    updateMeetingStatus,
    createMeeting
} from '../../firebase/firestoreService';
import ScheduleMeetingModal from './ScheduleMeetingModal';

const MeetingHub = ({ currentUser, isAdmin = false }) => {
    const [userData] = useContext(AuthContext) || [[]];
    const [meetings, setMeetings] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [toastMessage, setToastMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'live' | 'scheduled'

    useEffect(() => {
        const unsubscribe = subscribeToMeetings((fetchedMeetings) => {
            if (Array.isArray(fetchedMeetings)) {
                setMeetings(fetchedMeetings);
            }
        });
        return () => unsubscribe();
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleStartInstantMeeting = async () => {
        const randStr = (len) => Math.random().toString(36).substring(2, 2 + len);
        const code = `xyz-${randStr(3)}-${randStr(3)}`;
        const instantUrl = `https://meet.google.com/${code}`;
        const hostName = currentUser?.firstName || 'Nitin';

        try {
            await createMeeting({
                title: `Instant Quick Sync (${hostName})`,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: '30 mins',
                meetUrl: instantUrl,
                meetCode: code,
                agenda: 'Instant live discussion room created from XYZ OPS dashboard.',
                hostName,
                attendees: ['All'],
                department: 'All',
                status: 'live'
            });

            navigator.clipboard.writeText(instantUrl);
            showToast(`🚀 Instant Google Meet created & link copied: ${instantUrl}`);
            window.open(instantUrl, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error('Error starting instant meeting:', err);
            showToast(`Error: ${err.message}`);
        }
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (!window.confirm('Delete this meeting session?')) return;
        try {
            await deleteMeeting(meetingId);
            showToast('Meeting removed successfully.');
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    const handleToggleStatus = async (meeting) => {
        const nextStatus = meeting.status === 'live' ? 'completed' : 'live';
        try {
            await updateMeetingStatus(meeting.id, nextStatus);
            showToast(`Meeting status updated to "${nextStatus.toUpperCase()}"`);
        } catch (err) {
            showToast(`Error: ${err.message}`);
        }
    };

    // Filter logic
    const filteredMeetings = meetings.filter(m => {
        const matchesQuery = (
            m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.hostName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.meetCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.agenda?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const matchesDept = departmentFilter === 'All' || m.department === departmentFilter || m.department === 'All';
        const matchesTab = (
            activeTab === 'all' ||
            (activeTab === 'live' && m.status === 'live') ||
            (activeTab === 'scheduled' && m.status === 'scheduled')
        );

        return matchesQuery && matchesDept && matchesTab;
    });

    const liveCount = meetings.filter(m => m.status === 'live').length;
    const scheduledCount = meetings.filter(m => m.status === 'scheduled').length;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Live Meeting Hub</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0084ff] border border-sky-200">
                            Google Meet Integration
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Broadcast live meetings, start instant video calls, or schedule department syncs.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStartInstantMeeting}
                        className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                        <span>🔴 Start Instant Meet</span>
                    </button>
                    <button
                        onClick={() => setShowScheduleModal(true)}
                        className="px-4 py-2 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                        <span>📅 Schedule Meet</span>
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="p-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg animate-bounce">
                    {toastMessage}
                </div>
            )}

            {/* Filter Tabs and Search Bar Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            All ({meetings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${activeTab === 'live' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            Live Now ({liveCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('scheduled')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'scheduled' ? 'bg-white text-[#0084ff] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Scheduled ({scheduledCount})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-72">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search meetings by title or host..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#0084ff] outline-none text-slate-700 bg-slate-50/50"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Meetings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {filteredMeetings.length > 0 ? (
                        filteredMeetings.map((m) => {
                            const isLive = m.status === 'live';
                            return (
                                <div
                                    key={m.id}
                                    className={`rounded-xl border p-5 transition-all bg-white flex flex-col justify-between ${isLive
                                            ? 'border-rose-300 ring-2 ring-rose-100 shadow-sm'
                                            : 'border-slate-200 shadow-sm hover:border-slate-300'
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isLive
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                                    : 'bg-sky-50 text-[#0084ff] border border-sky-200'
                                                }`}>
                                                {isLive ? '🔴 LIVE NOW' : '📅 SCHEDULED'}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                {m.date} • {m.time}
                                            </span>
                                        </div>

                                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                                            {m.title}
                                        </h4>

                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {m.agenda || 'Team sync and sprint review.'}
                                        </p>

                                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                                            <span className="font-semibold text-slate-700">Host:</span>
                                            <span>{m.hostName}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                {m.department || 'All'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <a
                                            href={m.meetUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${isLive
                                                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                                                    : 'bg-sky-50 hover:bg-sky-100 text-[#0084ff] border border-sky-200'
                                                }`}
                                        >
                                            <span>Join Meet</span>
                                            <span>↗</span>
                                        </a>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(m.meetUrl);
                                                    showToast('Link copied to clipboard!');
                                                }}
                                                className="text-xs text-slate-400 hover:text-slate-700"
                                                title="Copy Link"
                                            >
                                                📋 Copy
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteMeeting(m.id)}
                                                    className="text-xs text-slate-400 hover:text-rose-600"
                                                    title="Delete Meeting"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                            No meetings found. Start an instant meet or schedule a session.
                        </div>
                    )}
                </div>
            </div>

            {showScheduleModal && (
                <ScheduleMeetingModal
                    currentUser={currentUser}
                    onClose={() => setShowScheduleModal(false)}
                    onCreated={() => {
                        setShowScheduleModal(false);
                        showToast('Meeting scheduled successfully!');
                    }}
                />
            )}
        </div>
    );
};

export default MeetingHub;
