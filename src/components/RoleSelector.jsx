import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { DIRECTOR_CREDENTIALS, COLLEGE_INFO } from '../data/mockData';
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
  Building2,
  UserPlus,
  Mail,
  Hash,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function RoleSelector({ onClose }) {
  const {
    currentRole,
    setCurrentRole,
    activeDepartmentId,
    setActiveDepartmentId,
    departments,
    setIsAuthenticated,
    loginStudent,
  } = usePortal();

  // 'login' | 'register'
  const [mode, setMode] = useState('login');

  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [selectedDeptId, setSelectedDeptId] = useState(activeDepartmentId);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { registerStudent } = usePortal();

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    surname: '',
    email: '',
    prn: '',
    departmentId: activeDepartmentId,
    password: '',
    confirmPassword: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  const selectedDeptObj = departments.find(d => d.id === selectedDeptId) || departments[0];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    if (selectedRole === 'director') {
      if (cleanUsername === DIRECTOR_CREDENTIALS.username && cleanPassword === DIRECTOR_CREDENTIALS.password) {
        setCurrentRole('director');
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage('Invalid Director credentials. Please check your username and password.');
      }
    } else if (selectedRole === 'hod') {
      const deptCreds = selectedDeptObj.credentials;
      const expectedUsernames = [
        deptCreds.hodUsername.toLowerCase(),
        `${selectedDeptObj.shortName.toLowerCase()}.hod.nmiet`,
      ];
      if (expectedUsernames.includes(cleanUsername) && cleanPassword === deptCreds.hodPassword) {
        setCurrentRole('hod');
        setActiveDepartmentId(selectedDeptId);
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage(`Invalid HOD credentials for ${selectedDeptObj.shortName}. Please check username and password.`);
      }
    } else if (selectedRole === 'coordinator') {
      const deptCreds = selectedDeptObj.credentials;
      const expectedUsernames = [
        deptCreds.coordUsername.toLowerCase(),
        `${selectedDeptObj.shortName.toLowerCase()}.cord.nmiet`,
      ];
      if (expectedUsernames.includes(cleanUsername) && cleanPassword === deptCreds.coordPassword) {
        setCurrentRole('coordinator');
        setActiveDepartmentId(selectedDeptId);
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage(`Invalid Coordinator credentials for ${selectedDeptObj.shortName}. Please check username and password.`);
      }
    } else if (selectedRole === 'student') {
      // Student login uses registered student accounts
      const result = loginStudent(cleanUsername, cleanPassword);
      if (result.success) {
        // Set department from student profile
        const studentDeptId = result.student.departmentId;
        setActiveDepartmentId(studentDeptId);
        setCurrentRole('student');
        setIsAuthenticated(true);
        onClose();
      } else {
        setErrorMessage(result.message);
      }
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regForm.name.trim() || !regForm.surname.trim()) {
      setErrorMessage('Please enter your first and last name.');
      return;
    }
    if (!regForm.prn.trim()) {
      setErrorMessage('PRN number is required.');
      return;
    }
    if (!regForm.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }
    if (regForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Auto-generate email if user typed just name.surname (no domain)
    let email = regForm.email.trim().toLowerCase();
    if (!email.includes('@')) {
      email = `${email}@nmiet.edu.in`;
    }

    const result = registerStudent({
      ...regForm,
      email,
    });

    if (result.success) {
      setSuccessMessage(
        'Registration submitted! Your request has been sent to the department coordinator for approval. You will be able to login once approved.'
      );
      setRegForm({ name: '', surname: '', email: '', prn: '', departmentId: activeDepartmentId, password: '', confirmPassword: '' });
    } else {
      setErrorMessage(result.message);
    }
  };

  const roleButtons = [
    { role: 'director',    icon: Crown,         label: 'Director',    color: 'amber' },
    { role: 'hod',         icon: ShieldCheck,   label: 'HOD',         color: 'indigo' },
    { role: 'coordinator', icon: UserCheck,     label: 'Coordinator', color: 'cyan' },
    { role: 'student',     icon: GraduationCap, label: 'Student',     color: 'emerald' },
  ];

  const colorMap = {
    amber:   { active: 'bg-amber-500/20 border-amber-400 text-amber-300',   icon: 'text-amber-400' },
    indigo:  { active: 'bg-indigo-500/20 border-indigo-400 text-indigo-300', icon: 'text-indigo-400' },
    cyan:    { active: 'bg-cyan-500/20 border-cyan-400 text-cyan-300',       icon: 'text-cyan-400' },
    emerald: { active: 'bg-emerald-500/20 border-emerald-400 text-emerald-300', icon: 'text-emerald-400' },
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
            {mode === 'login' ? 'Sign In to Portal' : 'Student Registration'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{COLLEGE_INFO.fullName}</p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ══════════ LOGIN MODE ══════════ */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs">

            {/* Step 1: Select Role */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">1. Select Portal</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {roleButtons.map(({ role, icon: Icon, label, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => { setSelectedRole(role); setErrorMessage(''); setUsername(''); setPassword(''); }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-semibold ${
                      selectedRole === role
                        ? colorMap[color].active + ' font-bold'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedRole === role ? colorMap[color].icon : 'text-gray-500'}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Department Selector (HOD or Coordinator) */}
            {(selectedRole === 'hod' || selectedRole === 'coordinator') && (
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5">Select Department Portal</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => { setSelectedDeptId(e.target.value); setErrorMessage(''); }}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400 font-medium"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.shortName} — {d.name} (HOD: {d.hodName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student note */}
            {selectedRole === 'student' && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs text-cyan-300">
                Use your registered <strong>name.surname@nmiet.edu.in</strong> email and password to log in. Not registered yet? Click <strong>Register</strong> below.
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                {selectedRole === 'student' ? 'Email (name.surname@nmiet.edu.in)' : 'Portal Username'}
              </label>
              <div className="relative">
                {selectedRole === 'student'
                  ? <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  : <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                }
                <input
                  type={selectedRole === 'student' ? 'email' : 'text'}
                  required
                  placeholder={selectedRole === 'student' ? 'name.surname@nmiet.edu.in' : 'Enter username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full btn-primary justify-center text-xs py-3 text-white font-bold shadow-lg shadow-cyan-500/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal</span>
            </button>

            {/* Register Link (only for student) */}
            {selectedRole === 'student' && (
              <div className="text-center pt-1">
                <span className="text-gray-400 text-xs">New student? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline"
                >
                  Register your account
                </button>
              </div>
            )}
          </form>
        )}

        {/* ══════════ REGISTER MODE ══════════ */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-xs text-indigo-300">
              Register using your college email format: <strong>name.surname@nmiet.edu.in</strong>. Your coordinator will approve your request before you can log in.
            </div>

            {/* Name + Surname */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul"
                  value={regForm.name}
                  onChange={(e) => setRegForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Surname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patil"
                  value={regForm.surname}
                  onChange={(e) => setRegForm(p => ({ ...p, surname: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                College Email <span className="text-gray-500 font-normal">(name.surname@nmiet.edu.in)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="rahul.patil@nmiet.edu.in"
                  value={regForm.email}
                  onChange={(e) => setRegForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <p className="text-gray-500 mt-1 text-[11px]">Username = this email address</p>
            </div>

            {/* PRN */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">PRN Number</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024NMIET01948"
                  value={regForm.prn}
                  onChange={(e) => setRegForm(p => ({ ...p, prn: e.target.value.toUpperCase() }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono uppercase"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Department / Branch</span>
              </label>
              <select
                value={regForm.departmentId}
                onChange={(e) => setRegForm(p => ({ ...p, departmentId: e.target.value }))}
                className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.shortName} — {d.name}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Set Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                />
                <button type="button" onClick={() => setShowRegPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full btn-primary justify-center text-xs py-3 text-white font-bold shadow-lg shadow-cyan-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Submit Registration for Coordinator Approval</span>
            </button>

            {/* Back to Login */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setSelectedRole('student'); setErrorMessage(''); setSuccessMessage(''); }}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
