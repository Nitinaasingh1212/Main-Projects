import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Header = (props) => {
  const [, , dbInfo] = useContext(AuthContext) || []

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    props.changeUser('')
  }

  const displayName = props.data?.firstName || 'Admin'
  const designation = props.data?.designation || (props.data ? 'Team Member' : 'Chief Executive & Founder')
  const department = props.data?.department || (props.data ? 'Engineering' : 'Executive')
  const hierarchyLevel = props.data?.hierarchyLevel || 1

  return (
    <div className='flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-gray-800/80'>
        <div>
          <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
            {dbInfo?.isFirebaseConfigured ? (
              <span className='inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full'>
                <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
                Firestore Live
              </span>
            ) : (
              <span className='inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-full'>
                <span className='w-2 h-2 rounded-full bg-amber-400'></span>
                Local Mode
              </span>
            )}

            <span className='inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/70'>
              <span>🌳</span>
              <span>Layer {hierarchyLevel}</span>
            </span>

            <span className='inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-gray-300 border border-gray-700/60'>
              {department}
            </span>
          </div>

          <div className='flex items-baseline gap-2'>
            <h1 className='text-2xl font-bold text-white'>
              Hello, <span className='capitalize bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent'>{displayName}</span> 👋
            </h1>
            <span className='text-xs text-gray-400 font-medium hidden sm:inline'>
              • {designation}
            </span>
          </div>
        </div>

        <button 
          onClick={logOutUser} 
          className='bg-rose-600/90 hover:bg-rose-600 transition-all text-xs font-bold text-white px-4 py-2 rounded-xl shadow-lg shadow-rose-950 flex items-center gap-1.5'
        >
          <span>🚪</span>
          <span>Log Out</span>
        </button>
    </div>
  )
}

export default Header