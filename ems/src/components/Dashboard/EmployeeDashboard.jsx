import React, { useState, useEffect } from 'react';
import Header from '../other/Header';
import TaskListNumbers from '../other/TaskListNumbers';
import KanbanBoard from '../TaskList/KanbanBoard';
import MeetingHub from '../Meetings/MeetingHub';
import HierarchyFlow from '../Hierarchy/HierarchyFlow';
import { subscribeToMeetings } from '../../firebase/firestoreService';

const EmployeeDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'meetings' | 'hierarchy'
    const [liveMeetings, setLiveMeetings] = useState([]);
    const employee = props.data;

    useEffect(() => {
        const unsubscribe = subscribeToMeetings((meetings) => {
            if (Array.isArray(meetings)) {
                // Filter live meetings that are for All, this employee's department, or this employee specifically
                const relevant = meetings.filter(m => {
                    if (m.status !== 'live') return false;
                    const attendees = m.attendees || ['All'];
                    if (attendees.includes('All') || attendees.includes(employee?.firstName)) return true;
                    if (m.department === 'All' || m.department === employee?.department) return true;
                    return false;
                });
                setLiveMeetings(relevant);
            }
        });
        return () => unsubscribe();
    }, [employee]);

    return (
        <div className='p-4 sm:p-8 bg-[#141414] min-h-screen overflow-y-auto text-white'>
            <Header changeUser={props.changeUser} data={props.data} />

            {/* Live Meeting Alert Notification Bar */}
            {liveMeetings.length > 0 && (
                <div className='mt-4 bg-gradient-to-r from-rose-950/90 via-red-900/60 to-orange-950/80 border border-rose-600/70 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl animate-pulse'>
                    <div className='flex items-center gap-3'>
                        <span className='w-3 h-3 rounded-full bg-rose-500 animate-ping'></span>
                        <div>
                            <h4 className='text-xs font-bold text-white flex items-center gap-2'>
                                <span>🔴 LIVE GOOGLE MEET NOW:</span>
                                <span>{liveMeetings[0].title}</span>
                            </h4>
                            <p className='text-[11px] text-rose-200'>
                                Hosted by {liveMeetings[0].hostName} • {liveMeetings[0].agenda || 'Team discussion'}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <a
                            href={liveMeetings[0].meetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className='px-4 py-1.5 rounded-xl bg-white text-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-md'
                        >
                            <span>Join Meeting</span>
                            <span>↗</span>
                        </a>
                        <button
                            onClick={() => setActiveTab('meetings')}
                            className='px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-medium transition-colors border border-rose-400/40'
                        >
                            All Rooms
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className='mt-6 bg-[#1a1a1a] p-1.5 rounded-2xl border border-gray-800 inline-flex flex-wrap gap-1.5 shadow-xl'>
                <button
                    onClick={() => setActiveTab('kanban')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'kanban'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <span>📌</span>
                    <span>My Kanban Workflow</span>
                </button>

                <button
                    onClick={() => setActiveTab('meetings')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'meetings'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <span>🎥</span>
                    <span>Google Meet & Live Rooms</span>
                    {liveMeetings.length > 0 && (
                        <span className='px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono'>
                            {liveMeetings.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('hierarchy')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'hierarchy'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-950'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <span>🌳</span>
                    <span>Team Hierarchy Flow</span>
                    <span className='px-1.5 py-0.2 rounded-full text-[10px] bg-purple-900/90 text-purple-300 border border-purple-700/60'>
                        Org Chart
                    </span>
                </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'kanban' && (
                <div>
                    <TaskListNumbers data={props.data} />
                    <KanbanBoard data={props.data} />
                </div>
            )}

            {activeTab === 'meetings' && (
                <MeetingHub currentUser={props.data} isAdmin={false} />
            )}

            {activeTab === 'hierarchy' && (
                <HierarchyFlow currentUser={props.data} isAdmin={false} />
            )}
        </div>
    );
};

export default EmployeeDashboard;