import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronDown,
} from 'lucide-react';
import { useAuth, ROLE_CONFIG } from '../context/AuthContext';
import { UserRole } from '../types';
import { useToast } from '../components/ui/Toast';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithSSO, loginWithPersona } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('business_admin');
  const [email, setEmail] = useState<string>(ROLE_CONFIG.business_admin.email);
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSSOLoading, setIsSSOLoading] = useState<string | null>(null);

  // Handle persona selection change
  const handlePersonaChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setEmail(ROLE_CONFIG[newRole].email);
    setPassword('admin123');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showToast(`Welcome back! Signed in as ${ROLE_CONFIG[selectedRole].shortTitle}`, 'success');
        const targetRoute = selectedRole === 'client' ? '/portal' : '/';
        navigate(targetRoute, { replace: true });
      } else {
        showToast(result.message || 'Login failed. Please verify credentials.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Unexpected login error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: 'google' | 'supabase') => {
    setIsSSOLoading(provider);
    try {
      const result = await loginWithSSO(provider, selectedRole);
      if (result.success) {
        showToast(`Successfully authenticated via ${provider.toUpperCase()} SSO!`, 'success');
        const targetRoute = selectedRole === 'client' ? '/portal' : '/';
        navigate(targetRoute, { replace: true });
      } else {
        showToast(result.message || 'SSO authentication failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'SSO failed', 'error');
    } finally {
      setIsSSOLoading(null);
    }
  };

  const handleQuickPersonaLogin = async (role: UserRole) => {
    handlePersonaChange(role);
    setIsLoading(true);
    const result = await loginWithPersona(role);
    setIsLoading(false);
    if (result.success) {
      showToast(`Logged in instantly as ${ROLE_CONFIG[role].shortTitle}`, 'success');
      const targetRoute = role === 'client' ? '/portal' : '/';
      navigate(targetRoute, { replace: true });
    } else {
      showToast(result.message || 'Login failed', 'error');
    }
  };

  const activePersona = ROLE_CONFIG[selectedRole];

  return (
    <div className="min-h-screen w-full relative bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-4 lg:p-6 2xl:p-10 overflow-y-auto overflow-x-hidden font-sans select-none">
      {/* ============================================================ */}
      {/* PINTEREST TREND: AMBIENT GLOWING FLOATING BUBBLES BACKGROUND */}
      {/* ============================================================ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Morphing Gradient Bubbles - Scaled for all viewports up to 4K */}
        <div className="absolute -top-24 sm:-top-32 -left-24 sm:-left-32 w-72 sm:w-96 3xl:w-[32rem] 4k:w-[42rem] h-72 sm:h-96 3xl:h-[32rem] 4k:h-[42rem] rounded-full bg-gradient-to-tr from-brand-600/40 to-indigo-400/30 animate-float-slow filter blur-3xl" />
        <div className="absolute top-1/4 -right-16 sm:-right-24 w-80 sm:w-[28rem] 3xl:w-[36rem] 4k:w-[48rem] h-80 sm:h-[28rem] 3xl:h-[36rem] 4k:h-[48rem] rounded-full bg-gradient-to-bl from-purple-600/30 via-pink-500/20 to-brand-500/30 animate-float-reverse filter blur-3xl" />
        <div className="absolute -bottom-20 sm:-bottom-24 left-1/3 w-64 sm:w-80 3xl:w-[28rem] 4k:w-[36rem] h-64 sm:h-80 3xl:h-[28rem] 4k:h-[36rem] rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-400/20 animate-float-horizontal filter blur-2xl" />
        <div className="absolute top-2/3 -left-16 sm:-left-20 w-60 sm:w-72 3xl:w-96 h-60 sm:h-72 3xl:h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/25 animate-pulse-glow" />

        {/* Floating Translucent Glass Bubbles */}
        <div
          className="absolute top-[12%] left-[10%] w-12 sm:w-16 h-12 sm:h-16 rounded-full glass-panel border border-white/20 animate-float-slow shadow-lg shadow-indigo-500/10 flex items-center justify-center"
          style={{ animationDuration: '7s' }}
        >
          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/10 blur-xs" />
        </div>
        <div
          className="absolute bottom-[16%] right-[8%] w-16 sm:w-24 h-16 sm:h-24 rounded-full glass-panel border border-white/20 animate-float-reverse shadow-xl shadow-purple-500/10 flex items-center justify-center"
          style={{ animationDuration: '9s' }}
        >
          <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-white/10 blur-xs" />
        </div>
        <div
          className="absolute top-[60%] left-[6%] w-10 sm:w-12 h-10 sm:h-12 rounded-full glass-panel border border-white/20 animate-float-slow"
          style={{ animationDuration: '11s' }}
        />
        <div
          className="absolute top-[8%] right-[22%] w-14 sm:w-20 h-14 sm:h-20 rounded-full glass-panel border border-white/20 animate-float-horizontal"
          style={{ animationDuration: '13s' }}
        />

        {/* Subtle Tech Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* MAIN AUTHENTICATION CONTAINER (PINTEREST / DRIBBLE SPLIT CARD) */}
      {/* Fits gracefully within 125% scale & laptop 700-800px viewports */}
      {/* Scales smoothly from mobile 320px to 4K displays */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl rounded-2xl sm:rounded-3xl glass-panel border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        {/* MOBILE COMPACT HEADER (Visible only on < lg screens) */}
        <div className="lg:hidden p-4 sm:p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/70 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Activity className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight text-white block">
                Client<span className="text-brand-400">Pulse</span> SaaS
              </span>
              <span className="text-[10px] text-slate-400 block">AI Client Operations</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SOC2 Secure
          </span>
        </div>

        {/* LEFT COLUMN: BRAND HERO & FLOATING METRIC BUBBLES (Desktop / Laptop / 4K) */}
        <div className="hidden lg:flex lg:col-span-5 p-6 xl:p-8 2xl:p-10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/70 border-r border-white/10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Light Orb */}
          <div className="absolute top-10 right-10 w-48 h-48 bg-brand-500/20 rounded-full filter blur-2xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
                <Activity className="w-3 h-3 text-white animate-pulse" />
              </div>
              <span className="text-xs font-bold tracking-tight text-white">
                Client<span className="text-brand-400">Pulse</span> SaaS
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                v1.0
              </span>
            </div>

            <h1 className="text-xl xl:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
              AI Client Operations & Workflow Platform.
            </h1>
            <p className="text-xs xl:text-sm text-slate-400 leading-relaxed">
              Designed for freelancers, software agencies, and consulting teams to automate proposals, project sign-offs, and retention health.
            </p>
          </div>

          {/* Pinterest-Style Floating Telemetry Bubbles */}
          <div className="relative z-10 py-4 xl:py-5 space-y-2.5">
            {/* Bubble 1: Health Pulse */}
            <div className="p-2.5 xl:p-3 rounded-xl glass-panel border border-white/15 shadow-md flex items-center gap-2.5 xl:gap-3 transform hover:scale-[1.02] transition-all duration-300 bg-slate-900/60 backdrop-blur-md animate-float-slow">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="truncate">NovaTech Enterprises</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0 ml-1">
                    92/100 Pulse
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Algorithmic churn risk: <b className="text-emerald-400 font-medium">Healthy Client</b>
                </p>
              </div>
            </div>

            {/* Bubble 2: Local AI Synthesis */}
            <div
              className="p-2.5 xl:p-3 rounded-xl glass-panel border border-white/15 shadow-md flex items-center gap-2.5 xl:gap-3 transform hover:scale-[1.02] transition-all duration-300 bg-slate-900/60 backdrop-blur-md animate-float-reverse"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Ollama Local LLM</span>
                  <span className="text-[9px] bg-brand-500/20 text-brand-300 px-1.5 py-0.2 rounded font-mono border border-brand-500/30">
                    Zero-Cost
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Milestone scope & quotation items generated in 1.2s
                </p>
              </div>
            </div>

            {/* Bubble 3: Milestone Sign-off */}
            <div className="p-2.5 xl:p-3 rounded-xl glass-panel border border-white/15 shadow-md flex items-center gap-2.5 xl:gap-3 transform hover:scale-[1.02] transition-all duration-300 bg-slate-900/60 backdrop-blur-md">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Client Milestone Sign-off</span>
                  <span className="text-[10px] font-mono text-purple-300 font-semibold">$11,875</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  50% initial deposit invoice auto-generated
                </p>
              </div>
            </div>
          </div>

          {/* Footer Highlights */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Shield className="w-3.5 h-3.5 text-brand-400" /> Multi-Tenant Role Isolation
            </span>
            <span className="font-mono text-[10px] text-slate-500">PostgreSQL Ready</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM & PERSONA SELECTOR */}
        <div className="lg:col-span-7 p-5 sm:p-6 lg:p-7 xl:p-8 2xl:p-10 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-3.5 sm:space-y-4 xl:space-y-5">
            {/* Form Title */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sign In</h2>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Secure Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your workspace persona and enter credentials to enter ClientPulse.
              </p>
            </div>

            {/* ============================================================ */}
            {/* 1. SELECT PERSONA DROPDOWN */}
            {/* ============================================================ */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-400" /> Select Workspace Persona:
                </span>
                <span className="text-[10px] text-brand-400 font-mono lowercase">click to change role</span>
              </label>

              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => handlePersonaChange(e.target.value as UserRole)}
                  className="w-full bg-slate-800/80 text-white font-medium text-xs rounded-xl py-2 sm:py-2.5 px-3 border border-slate-700/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all cursor-pointer appearance-none pr-10"
                >
                  <option value="business_admin">👑 Business Admin (Agency Owner / Director)</option>
                  <option value="employee">⚡ Employee (Developer / Project Manager)</option>
                  <option value="client">🤝 Client (Customer Self-Service Portal)</option>
                  <option value="super_admin">🛡️ Super Admin (Platform Administrator)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dynamic Persona Role Badge & Description */}
              <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-start gap-2 text-xs">
                <span className="text-sm shrink-0">{activePersona.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-brand-300 text-xs block leading-tight">
                    {activePersona.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block leading-tight mt-0.5 truncate">
                    {activePersona.description}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Demo Persona Chips - Fixed text truncation */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Fast-Switch Demo Personas:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-1.5">
                {(['business_admin', 'client', 'employee', 'super_admin'] as UserRole[]).map((r) => {
                  const cfg = ROLE_CONFIG[r];
                  const isActive = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleQuickPersonaLogin(r)}
                      title={`Login as ${cfg.title}`}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-brand-600/30 text-white border-brand-500 shadow-sm ring-1 ring-brand-500/40'
                          : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1">
                        <span>{cfg.icon}</span>
                        <span className="truncate">{cfg.shortTitle}</span>
                      </span>
                      {isActive && <CheckCircle2 className="w-3 h-3 text-brand-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 2. CREDENTIAL FORM: EMAIL ID & PASSWORD */}
            {/* ============================================================ */}
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-3.5">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-800/60 text-white placeholder-slate-500 text-xs rounded-xl py-2 sm:py-2.5 pl-9 pr-4 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('For demo testing, password is set to "admin123"', 'info')}
                    className="text-[10px] sm:text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-800/60 text-white placeholder-slate-500 text-xs rounded-xl py-2 sm:py-2.5 pl-9 pr-9 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* 3. LOGIN BUTTON */}
              {/* ============================================================ */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {activePersona.shortTitle} Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* ============================================================ */}
            {/* 4. ENTERPRISE SSO BUTTONS */}
            {/* ============================================================ */}
            <div className="space-y-2 sm:space-y-2.5 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900/90 px-2.5 text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-mono shrink-0">
                  Or continue with SSO
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {/* Google SSO Button */}
                <button
                  type="button"
                  onClick={() => handleSSO('google')}
                  disabled={isSSOLoading !== null}
                  className="py-2 sm:py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-all hover:border-slate-600"
                >
                  {isSSOLoading === 'google' ? (
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Google SSO</span>
                </button>

                {/* Supabase / Enterprise SSO Button */}
                <button
                  type="button"
                  onClick={() => handleSSO('supabase')}
                  disabled={isSSOLoading !== null}
                  className="py-2 sm:py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-all hover:border-slate-600"
                >
                  {isSSOLoading === 'supabase' ? (
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.127a.396.396 0 0 0 .307.635H12v8.958a.396.396 0 0 0 .716.233l10.964-13.964a.396.396 0 0 0-.318-.635z" />
                    </svg>
                  )}
                  <span>Supabase SSO</span>
                </button>
              </div>
            </div>

            {/* Platform Security Note */}
            <div className="text-center pt-1">
              <p className="text-[10px] text-slate-500">
                ClientPulse enforces Row-Level Multi-Tenant Security & local AI confidentiality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
