import { useState } from 'react';
import { LogIn, Eye, EyeOff, Star, Bookmark, Bell, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, remember);
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center px-5 py-12 relative overflow-hidden">

      <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/35 -top-16 -right-16 blur-[80px] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-[#6ea8fe]/08 -bottom-10 -left-10 blur-[80px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(110,168,254,1) 1px,transparent 1px),linear-gradient(90deg,rgba(110,168,254,1) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">

        <div className="flex items-center justify-center gap-2 mb-9">
          <span className="text-[20px]">🎬</span>
          <span className="text-[26px] font-black tracking-[1px] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            WatchWise
          </span>
        </div>

        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="mb-7">
            <h1 className="text-[22px] font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-[13.5px] text-white/45">
              New here?{' '}
              <Link to="/signup" className="text-[#6ea8fe] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] pr-11 rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-[13px] text-red-400">{error}</p>
              </div>
            )}

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
              <Link to="/forgot-password" className="text-[13px] text-[#6ea8fe] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} strokeWidth={2.5} />
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

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
