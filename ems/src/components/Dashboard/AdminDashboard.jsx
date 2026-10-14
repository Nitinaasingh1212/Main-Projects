import React, { useState, useEffect } from 'react';
import Header from '../other/Header';
import CreateTask from '../other/CreateTask';
import AllTask from '../other/AllTask';
import MeetingHub from '../Meetings/MeetingHub';
import HierarchyFlow from '../Hierarchy/HierarchyFlow';
import { subscribeToMeetings } from '../../firebase/firestoreService';

const AdminDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'meetings' | 'hierarchy'
    const [liveMeetings, setLiveMeetings] = useState([]);
    const [prefilledAssignee, setPrefilledAssignee] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToMeetings((meetings) => {
            if (Array.isArray(meetings)) {
                setLiveMeetings(meetings.filter(m => m.status === 'live'));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAssignTaskFromHierarchy = (employeeName) => {
        setPrefilledAssignee(employeeName);
        setActiveTab('tasks');
        window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    return (
        <div className='min-h-screen w-full p-4 sm:p-7 bg-[#111111] overflow-y-auto text-white'>
            <Header changeUser={props.changeUser} />

            {/* Live Meeting Alert Notification Bar */}
            {liveMeetings.length > 0 && (
                <div className='mt-4 bg-gradient-to-r from-rose-950/90 via-red-900/60 to-orange-950/80 border border-rose-600/70 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl animate-pulse'>
                    <div className='flex items-center gap-3'>
                        <span className='w-3 h-3 rounded-full bg-rose-500 animate-ping'></span>
                        <div>
                            <h4 className='text-xs font-bold text-white flex items-center gap-2'>
                                <span>🔴 LIVE GOOGLE MEET:</span>
                                <span>{liveMeetings[0].title}</span>
                            </h4>
                            <p className='text-[11px] text-rose-200'>
                                Hosted by {liveMeetings[0].hostName} • {liveMeetings[0].meetUrl}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <a
                            href={liveMeetings[0].meetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className='px-3.5 py-1.5 rounded-xl bg-white text-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-md'
                        >
                            <span>Join Meeting</span>
                            <span>↗</span>
                        </a>
                        <button
                            onClick={() => setActiveTab('meetings')}
                            className='px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-medium transition-colors border border-rose-400/40'
                        >
                            View All Rooms
                        </button>
                    </div>
                </div>
            )}

            {/* Main Navigation Tabs */}
            <div className='mt-6 bg-[#181818] p-1.5 rounded-2xl border border-gray-800 inline-flex flex-wrap gap-1.5 shadow-xl'>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'tasks'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <span>📋</span>
                    <span>Task Overview & Assignment</span>
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
                    <span>Google Meet Hub</span>
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
                    <span>Hierarchy Flow Chart</span>
                    <span className='px-1.5 py-0.2 rounded-full text-[10px] bg-purple-900/90 text-purple-300 border border-purple-700/60'>
                        5 Layers
                    </span>
                </button>
            </div>

            {/* Active View Rendering */}
            {activeTab === 'tasks' && (
                <div>
                    <CreateTask defaultAssignee={prefilledAssignee} />
                    <AllTask />
                </div>
            )}

            {activeTab === 'meetings' && (
                <MeetingHub currentUser={{ firstName: 'Admin', role: 'admin' }} isAdmin={true} />
            )}

            {activeTab === 'hierarchy' && (
                <HierarchyFlow
                    currentUser={{ firstName: 'Admin', role: 'admin' }}
                    isAdmin={true}
                    onAssignTaskToEmployee={handleAssignTaskFromHierarchy}
                />
            )}
        </div>
    );
};

export default AdminDashboard;