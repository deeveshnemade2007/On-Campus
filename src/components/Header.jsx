import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Building2, 
  Crown, 
  GraduationCap, 
  UserCheck, 
  UserPlus, 
  Layers, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Ticket
} from 'lucide-react';
import RoleSelector from './RoleSelector';

export default function Header({ activeTab, setActiveTab }) {
  const { 
    currentRole, 
    activeDepartmentId, 
    setActiveDepartmentId, 
    departments,
    resetDemoData,
    bookings,
    events
  } = usePortal();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Active department object
  const activeDept = departments.find(d => d.id === activeDepartmentId) || departments[0];

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'director':
        return {
          title: 'Director Portal',
          icon: Crown,
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'hod':
        return {
          title: `HOD - ${activeDept.shortName}`,
          icon: ShieldCheck,
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
        };
      case 'coordinator':
        return {
          title: `Coord - ${activeDept.shortName}`,
          icon: UserCheck,
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        };
      case 'student':
      default:
        return {
          title: 'Student Portal',
          icon: GraduationCap,
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  const myBookingsCount = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingHodCount = events.filter(e => e.status === 'pending_verification' && (currentRole === 'director' || e.departmentId === activeDepartmentId)).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                  ON <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">CAMPUS</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  8 Departments
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Unified College Event & Slot Portal</p>
            </div>
          </div>

          {/* Department Selector (When applicable) */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5">
            <Layers className="w-4 h-4 text-cyan-400 ml-2" />
            <select
              value={activeDepartmentId}
              onChange={(e) => setActiveDepartmentId(e.target.value)}
              className="bg-transparent text-sm text-gray-200 border-none outline-none pr-4 cursor-pointer font-medium"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-[#121826] text-white">
                  {dept.shortName} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Student "My Bookings" button */}
            {currentRole === 'student' && (
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'my-bookings'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Ticket className="w-4 h-4 text-cyan-400" />
                <span>My Bookings</span>
                {myBookingsCount > 0 && (
                  <span className="bg-cyan-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-1">
                    {myBookingsCount}
                  </span>
                )}
              </button>
            )}

            {/* HOD / Coordinator Notifications */}
            {currentRole === 'hod' && pendingHodCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium animate-pulse">
                <ShieldCheck className="w-4 h-4" />
                {pendingHodCount} Event(s) Pending Verification
              </span>
            )}

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition hover:scale-[1.02] ${badge.bg}`}
              title="Click to change Portal Role (Director, HOD, Coordinator, Student)"
            >
              <BadgeIcon className="w-4 h-4" />
              <span>{badge.title}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70 ml-1" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetDemoData}
              title="Reset initial events & demo bookings"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Role Selector Modal */}
      {isRoleModalOpen && (
        <RoleSelector onClose={() => setIsRoleModalOpen(false)} />
      )}
    </>
  );
}
