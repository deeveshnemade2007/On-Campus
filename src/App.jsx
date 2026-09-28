import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import Header from './components/Header';
import DirectorDashboard from './pages/DirectorDashboard';
import HodDashboard from './pages/HodDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import StudentPortal from './pages/StudentPortal';
import EventDetailModal from './components/EventDetailModal';
import { Building2, Shield, Heart } from 'lucide-react';

function MainApp() {
  const { currentRole, activeDepartment } = usePortal();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-bookings'
  const [inspectedEvent, setInspectedEvent] = useState(null);

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

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {renderRolePortal()}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060911]/90 py-8 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white font-heading">ON CAMPUS</span>
            <span className="text-gray-500">• Engineering College Event & Slot Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-gray-400">8 Department Portals</span>
            <span className="text-gray-400">4 Access Levels</span>
            <span className="text-cyan-400 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> HOD Verified
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
