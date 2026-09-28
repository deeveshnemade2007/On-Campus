import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Crown, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function RoleSelector({ onClose }) {
  const { 
    currentRole, 
    setCurrentRole, 
    activeDepartmentId, 
    setActiveDepartmentId, 
    departments 
  } = usePortal();

  const handleSelectRole = (role, deptId = null) => {
    setCurrentRole(role);
    if (deptId) {
      setActiveDepartmentId(deptId);
    }
    onClose();
  };

  const roles = [
    {
      id: 'director',
      name: 'Director Portal',
      description: 'Global executive access. View department performance, overall slot bookings, and progress of all 8 clubs & departments.',
      icon: Crown,
      color: 'from-amber-500 to-yellow-600',
      badge: 'Executive Command',
      deptSelectable: false
    },
    {
      id: 'hod',
      name: 'HOD Portal (Head of Department)',
      description: 'Department Head view. Verify & approve coordinator event requests, approve coordinators, and manage department portal.',
      icon: ShieldCheck,
      color: 'from-indigo-600 to-purple-600',
      badge: 'Department Specific (8 Portals)',
      deptSelectable: true
    },
    {
      id: 'coordinator',
      name: 'Coordinator Portal',
      description: 'Event Coordinator view. Publish new event proposals, submit for HOD verification, and monitor live slot registrations.',
      icon: UserCheck,
      color: 'from-cyan-600 to-blue-600',
      badge: 'Event Authoring',
      deptSelectable: true
    },
    {
      id: 'student',
      name: 'Normal Student Portal',
      description: 'Student view. Explore upcoming events across all 8 engineering departments, book time slots, and view dynamic QR passes.',
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Public & Slot Booking',
      deptSelectable: false
    }
  ];

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel w-full max-w-3xl p-6 sm:p-8 relative border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Switch Portal Access
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Choose Portal & Persona</h2>
          <p className="text-sm text-gray-400 mt-1">
            Select one of the 4 role portals below to experience the platform from different authorization levels.
          </p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = currentRole === r.id;

            return (
              <div
                key={r.id}
                className={`rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-white/10 border-cyan-400/60 shadow-lg shadow-cyan-500/10' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-heading mb-1.5 flex items-center gap-2">
                    {r.name}
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {r.description}
                  </p>
                </div>

                {/* Department selector dropdown if HOD or Coordinator */}
                {r.deptSelectable ? (
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <label className="text-[11px] font-medium text-gray-300 mb-1.5 block">
                      Select Department Portal (1 of 8):
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {departments.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => handleSelectRole(r.id, d.id)}
                          className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition truncate ${
                            currentRole === r.id && activeDepartmentId === d.id
                              ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50 font-bold'
                              : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold text-cyan-400 mr-1">{d.shortName}</span>
                          <span className="opacity-80">{d.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectRole(r.id)}
                    className="w-full mt-3 btn-primary text-xs justify-center py-2.5"
                  >
                    <span>Enter {r.name.split(' ')[0]} Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
          <span>Active Persona: <strong className="text-white capitalize">{currentRole}</strong> {currentRole !== 'director' && `(${departments.find(d => d.id === activeDepartmentId)?.shortName})`}</span>
          <button onClick={onClose} className="underline hover:text-white">Close Window</button>
        </div>
      </div>
    </div>
  );
}
