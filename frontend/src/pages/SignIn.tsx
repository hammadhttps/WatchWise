import { useState } from 'react';
import { LogIn, Eye, EyeOff, Star, Bookmark, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignIn = ({ onSwitchToSignUp }: { onSwitchToSignUp?: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(true);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');

  return (
    <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* BG orbs */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/35 -top-16 -right-16 blur-[80px] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-[#6ea8fe]/08 -bottom-10 -left-10 blur-[80px] pointer-events-none" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(110,168,254,1) 1px,transparent 1px),linear-gradient(90deg,rgba(110,168,254,1) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-9">
          <span className="text-[20px]">🎬</span>
          <span className="text-[26px] font-black tracking-[1px] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            WatchWise
          </span>
        </div>

        {/* Card */}
        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="mb-7">
            <h1 className="text-[22px] font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-[13.5px] text-white/45">
              New here?{' '}
              <Link to="/signup" className="text-[#6ea8fe] font-semibold bg-none border-none cursor-pointer hover:underline p-0">
              <button onClick={onSwitchToSignUp} className="text-[#6ea8fe] font-semibold bg-none border-none cursor-pointer hover:underline p-0">
                Create an account
              </button>
              </Link>
            </p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { label: 'Google', icon: (
                <svg width="15" height="15" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              )},
              { label: 'X / Twitter', icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              )},
            ].map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center justify-center gap-2 bg-white/[0.06] border border-white/12 text-white/70 hover:bg-white/12 hover:border-white/22 hover:text-white text-[13px] font-semibold py-2.5 rounded-lg transition-all cursor-pointer font-sans"
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] text-white/30 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] pr-11 rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-[13px] text-white/55 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-[15px] h-[15px] accent-[#6ea8fe] cursor-pointer"
              />
              Remember me
            </label>
            <button className="text-[13px] text-[#6ea8fe] font-semibold bg-transparent border-none cursor-pointer hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans">
            <LogIn size={16} strokeWidth={2.5} />
            Sign In
          </button>
        </div>

        {/* Feature hints */}
        <div className="mt-7 flex flex-col gap-2.5">
          {[
            { Icon: Star,     text: 'AI-powered personalized recommendations' },
            { Icon: Bookmark, text: 'Sync your watchlist across all devices'  },
            { Icon: Bell,     text: 'Get notified on new releases'             },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-[13px] text-white/45">
              <div className="w-7 h-7 rounded-[7px] flex-shrink-0 bg-[#6ea8fe]/10 border border-[#6ea8fe]/20 flex items-center justify-center">
                <Icon size={14} color="#6ea8fe" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignIn;