import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { DIRECTOR_CREDENTIALS, STUDENT_CREDENTIALS, COLLEGE_INFO } from '../data/mockData';
import { 
  Crown, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  X, 
  Lock, 
  User, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';

export default function RoleSelector({ onClose }) {
  const { 
    currentRole, 
    setCurrentRole, 
    activeDepartmentId, 
    setActiveDepartmentId, 
    departments,
    setIsAuthenticated
  } = usePortal();

  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [selectedDeptId, setSelectedDeptId] = useState(activeDepartmentId);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCredentialsHelp, setShowCredentialsHelp] = useState(false);

  const selectedDeptObj = departments.find(d => d.id === selectedDeptId) || departments[0];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (selectedRole === 'director') {
      if (cleanUsername === DIRECTOR_CREDENTIALS.username && cleanPassword === DIRECTOR_CREDENTIALS.password) {
        setCurrentRole('director');
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage('Invalid Director credentials! Expected: director.nmiet / director@123');
      }
    } else if (selectedRole === 'hod') {
      const deptCreds = selectedDeptObj.credentials;
      // Accept either dept code username (e.g. ce.hod.nmiet) or department_name.hod.nmiet
      const expectedUsernames = [
        deptCreds.hodUsername.toLowerCase(),
        `${selectedDeptObj.shortName.toLowerCase()}.hod.nmiet`,
        `${selectedDeptObj.name.toLowerCase().replace(/[^a-z]/g, '')}.hod.nmiet`
      ];
      const expectedPassword = deptCreds.hodPassword;

      if (expectedUsernames.includes(cleanUsername) && cleanPassword === expectedPassword) {
        setCurrentRole('hod');
        setActiveDepartmentId(selectedDeptId);
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage(`Invalid HOD credentials for ${selectedDeptObj.shortName}! Expected Username: ${deptCreds.hodUsername} | Password: ${deptCreds.hodPassword}`);
      }
    } else if (selectedRole === 'coordinator') {
      const deptCreds = selectedDeptObj.credentials;
      const expectedUsernames = [
        deptCreds.coordUsername.toLowerCase(),
        `${selectedDeptObj.shortName.toLowerCase()}.cord.nmiet`,
        `${selectedDeptObj.name.toLowerCase().replace(/[^a-z]/g, '')}.cord.nmiet`
      ];
      const expectedPassword = deptCreds.coordPassword;

      if (expectedUsernames.includes(cleanUsername) && cleanPassword === expectedPassword) {
        setCurrentRole('coordinator');
        setActiveDepartmentId(selectedDeptId);
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage(`Invalid Coordinator credentials for ${selectedDeptObj.shortName}! Expected Username: ${deptCreds.coordUsername} | Password: ${deptCreds.coordPassword}`);
      }
    } else if (selectedRole === 'student') {
      if (cleanUsername === STUDENT_CREDENTIALS.username || cleanUsername.includes('nmiet') || cleanUsername.length >= 4) {
        if (cleanPassword === STUDENT_CREDENTIALS.password || cleanPassword === 'student@123') {
          setCurrentRole('student');
          setIsAuthenticated(true);
          onClose();
        } else {
          setErrorMessage('Invalid Student Password! Expected password: student@123');
        }
      } else {
        setErrorMessage('Invalid Student Username! Expected: student.nmiet or your PRN');
      }
    }
  };

  const autofillDemoCredentials = () => {
    if (selectedRole === 'director') {
      setUsername(DIRECTOR_CREDENTIALS.username);
      setPassword(DIRECTOR_CREDENTIALS.password);
    } else if (selectedRole === 'hod') {
      setUsername(selectedDeptObj.credentials.hodUsername);
      setPassword(selectedDeptObj.credentials.hodPassword);
    } else if (selectedRole === 'coordinator') {
      setUsername(selectedDeptObj.credentials.coordUsername);
      setPassword(selectedDeptObj.credentials.coordPassword);
    } else if (selectedRole === 'student') {
      setUsername(STUDENT_CREDENTIALS.username);
      setPassword(STUDENT_CREDENTIALS.password);
    }
    setErrorMessage('');
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 relative border-cyan-500/40 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> {COLLEGE_INFO.shortName} Portal Authentication
          </div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Sign In to Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {COLLEGE_INFO.fullName}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs">
          
          {/* Step 1: Select Role */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">1. Select Target Portal</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <button
                type="button"
                onClick={() => { setSelectedRole('director'); setErrorMessage(''); }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'director'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Director</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole('hod'); setErrorMessage(''); }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'hod'
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>HOD</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole('coordinator'); setErrorMessage(''); }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'coordinator'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>Coordinator</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRole('student'); setErrorMessage(''); }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'student'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>Student</span>
              </button>

            </div>
          </div>

          {/* Department Selector (If HOD or Coordinator) */}
          {(selectedRole === 'hod' || selectedRole === 'coordinator') && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">
                Select Department Portal (1 of 8)
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => { setSelectedDeptId(e.target.value); setErrorMessage(''); }}
                className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400 font-medium"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortName} - {d.name} (HOD: {d.hodName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2: Username */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1 flex items-center justify-between">
              <span>Portal Username</span>
              <button 
                type="button" 
                onClick={autofillDemoCredentials}
                className="text-cyan-400 hover:text-cyan-300 text-[11px] underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Credentials
              </button>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Username (e.g. director.nmiet)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Step 3: Password */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Portal Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter Password (e.g. director@123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Submit Login */}
          <button
            type="submit"
            className="w-full btn-primary justify-center text-xs py-3 text-white font-bold shadow-lg shadow-cyan-500/20"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate & Enter {selectedRole.toUpperCase()} Portal</span>
          </button>

        </form>

        {/* Toggle Credentials Reference Helper */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setShowCredentialsHelp(!showCredentialsHelp)}
            className="text-xs text-gray-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showCredentialsHelp ? 'Hide NMIET Passwords Cheat Sheet' : 'Show NMIET Portal Passwords & Usernames'}</span>
          </button>

          {showCredentialsHelp && (
            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 space-y-3 font-mono">
              <div className="font-bold text-cyan-400 font-sans border-b border-white/10 pb-1">
                🔑 NMIET Credentials Matrix
              </div>
              
              <div>
                <span className="text-amber-300 font-bold block">1. Director Portal:</span>
                <div>Username: <strong className="text-white">director.nmiet</strong></div>
                <div>Password: <strong className="text-white">director@123</strong></div>
              </div>

              <div>
                <span className="text-indigo-300 font-bold block">2. HOD Portals (8 Departments):</span>
                <div>Username format: <strong className="text-white">&lt;dept_code&gt;.hod.nmiet</strong> (e.g. ce.hod.nmiet, cse.hod.nmiet, cseai.hod.nmiet, aids.hod.nmiet, me.hod.nmiet, entc.hod.nmiet, it.hod.nmiet, ece.hod.nmiet)</div>
                <div>Password format: <strong className="text-white">&lt;dept_code&gt;@123</strong> (e.g. ce@123, cse@123, cseai@123, aids@123, me@123, entc@123, it@123, ece@123)</div>
              </div>

              <div>
                <span className="text-cyan-300 font-bold block">3. Coordinator Portals:</span>
                <div>Username format: <strong className="text-white">&lt;dept_code&gt;.cord.nmiet</strong> (e.g. ce.cord.nmiet, cse.cord.nmiet, etc.)</div>
                <div>Password: <strong className="text-white">cordinator@123</strong></div>
              </div>

              <div>
                <span className="text-emerald-300 font-bold block">4. Normal Student Portal:</span>
                <div>Username: <strong className="text-white">student.nmiet</strong></div>
                <div>Password: <strong className="text-white">student@123</strong></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
