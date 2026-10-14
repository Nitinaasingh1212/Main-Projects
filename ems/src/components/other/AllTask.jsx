import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import EmployeeWorkModal from './EmployeeWorkModal'
import CreateEmployeeModal from './CreateEmployeeModal'

const AllTask = () => {
    const [userData] = useContext(AuthContext) || [[]]
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
    const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false)

    // Keep selected employee data fresh if real-time Firestore updates arrive
    const selectedEmployee = userData?.find(
        (e) => (e.docId && e.docId === selectedEmployeeId) ||
               (e.id && String(e.id) === String(selectedEmployeeId)) ||
               e.firstName === selectedEmployeeId
    ) || null

    return (
        <div className='bg-[#1c1c1c] p-5 rounded-2xl border border-gray-800 shadow-xl mt-5'>
            <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-base font-bold text-white flex items-center gap-2'>
                        <span>👥</span>
                        <span>Employee Task & Role Overview</span>
                    </h2>
                    <span className='text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full'>
                        💡 Click any employee to view work, roles & 1-on-1 Meet
                    </span>
                </div>
                <button
                    onClick={() => setShowCreateEmployeeModal(true)}
                    className='px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5'
                >
                    <span>➕</span>
                    <span>Add New Employee</span>
                </button>
            </div>

            <div className='bg-[#222222] mb-3 py-2.5 px-4 flex justify-between items-center rounded-xl text-white text-xs font-bold border border-gray-700'>
                <h2 className='w-2/6'>Employee / Designation / Layer</h2>
                <h3 className='w-1/6 text-center text-blue-400'>New Task</h3>
                <h5 className='w-1/6 text-center text-amber-400'>Active Task</h5>
                <h5 className='w-1/6 text-center text-emerald-400'>Completed</h5>
                <h5 className='w-1/6 text-center text-rose-400'>Failed</h5>
                <h5 className='w-1/6 text-right'>Action</h5>
            </div>

            <div className='overflow-auto max-h-80 space-y-2 pr-1'>
                {userData && userData.length > 0 ? (
                    userData.map((elem, idx) => {
                        const employeeKey = elem.docId || elem.id || elem.firstName
                        return (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedEmployeeId(employeeKey)}
                                className='border border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-950/10 cursor-pointer transition-all duration-150 py-3 px-4 flex justify-between items-center rounded-xl bg-black/30 group'
                                title={`Click to view all tasks & hierarchy of ${elem.firstName}`}
                            >
                                <div className='w-2/6 flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center justify-center uppercase shadow-sm'>
                                        {elem.avatar || (elem.firstName ? elem.firstName.charAt(0) : 'E')}
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-1.5'>
                                            <h2 className='text-sm font-bold text-white capitalize group-hover:text-emerald-300 transition-colors'>
                                                {elem.firstName}
                                            </h2>
                                            <span className='text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800'>
                                                L{elem.hierarchyLevel || 3}
                                            </span>
                                        </div>
                                        <p className='text-[11px] text-gray-400 truncate max-w-[200px]'>
                                            {elem.designation || 'Software Specialist'} • {elem.department || 'Eng'}
                                        </p>
                                    </div>
                                </div>
                                <h3 className='text-sm font-bold w-1/6 text-center text-blue-400'>{elem.taskCounts?.newTask ?? 0}</h3>
                                <h5 className='text-sm font-bold w-1/6 text-center text-amber-400'>{elem.taskCounts?.active ?? 0}</h5>
                                <h5 className='text-sm font-bold w-1/6 text-center text-emerald-400'>{elem.taskCounts?.completed ?? 0}</h5>
                                <h5 className='text-sm font-bold w-1/6 text-center text-rose-500'>{elem.taskCounts?.failed ?? 0}</h5>
                                <div className='w-1/6 text-right'>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedEmployeeId(employeeKey)
                                        }}
                                        className='text-xs px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-700 border border-emerald-700/50 text-emerald-200 font-semibold transition-colors inline-flex items-center gap-1 shadow-sm'
                                    >
                                        <span>View</span>
                                        <span>➔</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className='text-center py-8 text-gray-400 text-xs'>
                        Loading employee data from database...
                    </div>
                )}
            </div>

            {/* Modal to view all work of the clicked employee */}
            {selectedEmployee && (
                <EmployeeWorkModal 
                    employee={selectedEmployee} 
                    onClose={() => setSelectedEmployeeId(null)} 
                />
            )}

            {/* Modal to register a new employee */}
            {showCreateEmployeeModal && (
                <CreateEmployeeModal 
                    onClose={() => setShowCreateEmployeeModal(false)} 
                />
            )}
        </div>
    )
}

export default AllTask