import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import Header from './components/Header';
import DirectorDashboard from './pages/DirectorDashboard';
import HodDashboard from './pages/HodDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import StudentPortal from './pages/StudentPortal';
import EventDetailModal from './components/EventDetailModal';
import RoleSelector from './components/RoleSelector';
import { Building2, Shield, Lock, KeyRound } from 'lucide-react';

function MainApp() {
  const { currentRole, isAuthenticated, collegeInfo } = usePortal();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-bookings'
  const [inspectedEvent, setInspectedEvent] = useState(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  const renderRolePortal = () => {
    switch (currentRole) {
      case 'director':
        return <DirectorDashboard onSelectEvent={setInspectedEvent} />;
      case 'hod':
        return <HodDashboard onSelectEvent={setInspectedEvent} />;
      case 'coordinator':
        return <CoordinatorDashboard onSelectEvent={setInspectedEvent} />;
      case 'student':
      default:
        return (
          <StudentPortal 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onSelectEvent={setInspectedEvent} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* If not authenticated, show Portal Login Guard Gate */}
      {!isAuthenticated ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center my-auto">
          <div className="glass-panel p-8 sm:p-12 border-cyan-500/40 relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              Protected NMIET Event Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {collegeInfo.fullName}
            </h1>
            <p className="text-xs text-gray-300 mt-2 max-w-xl mx-auto leading-relaxed">
              Please sign in with your portal credentials (Director, HOD, Coordinator, or Student) to unlock the application.
            </p>

            <button
              onClick={() => setShowAuthGate(true)}
              className="btn-primary mt-6 py-3 px-8 text-xs font-bold mx-auto shadow-xl shadow-cyan-500/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>Enter Portal Passcode</span>
            </button>
          </div>

          {showAuthGate && <RoleSelector onClose={() => setShowAuthGate(false)} />}
        </div>
      ) : (
        /* Main Portal Body */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {renderRolePortal()}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060911]/90 py-8 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white font-heading">{collegeInfo.shortName} ON CAMPUS</span>
            <span className="text-gray-500">• {collegeInfo.fullName}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-gray-400">8 Department Portals</span>
            <span className="text-gray-400">4 Access Levels</span>
            <span className="text-cyan-400 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Password Secured
            </span>
          </div>
        </div>
      </footer>

      {/* Event Detail Modal */}
      {inspectedEvent && (
        <EventDetailModal 
          event={inspectedEvent} 
          onClose={() => setInspectedEvent(null)} 
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <MainApp />
    </PortalProvider>
  );
}
