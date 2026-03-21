import { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_META = [
  { label: '',       color: ''           },
  { label: 'Weak',   color: 'text-red-400'    },
  { label: 'Fair',   color: 'text-orange-400' },
  { label: 'Good',   color: 'text-yellow-400' },
  { label: 'Strong', color: 'text-green-400'  },
];

const SEG_COLORS = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];

const SetNewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = (location.state as { email: string }) || { email: '' };

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      navigate('/forgot-password');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 2) {
      setError('Password is too weak');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(email, password);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/sign');
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Reset failed');
      } else {
        setError('Reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  if (success) {
    return (
      <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center px-5 py-12 relative overflow-hidden">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/35 -top-16 -right-16 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[400px]">
          <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 mx-auto mb-6">
              <CheckCircle size={24} color="#22c55e" />
            </div>
            
            <h1 className="text-[22px] font-bold text-white mb-2">Password Reset!</h1>
            <p className="text-[13.5px] text-white/45 mb-6">
              Your password has been successfully reset. Redirecting you to sign in...
            </p>
            
            <div className="animate-pulse">
              <Link 
                to="/sign" 
                className="inline-flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 px-6 rounded-lg hover:bg-[#ddeaff] transition-all"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <Link to="/verify-questions" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[14px]">Back</span>
        </Link>

        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="text-center mb-7">
            <h1 className="text-[22px] font-bold text-white mb-2">Set New Password</h1>
            <p className="text-[13.5px] text-white/45">
              Enter a new strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] pr-11 rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-[3px] rounded-sm transition-all duration-300 ${i <= strength ? SEG_COLORS[strength] : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] mt-1 font-medium ${STRENGTH_META[strength].color}`}>
                    {STRENGTH_META[strength].label}
                  </p>
                </>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCpw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className={`w-full bg-white/[0.05] border text-white text-[14px] px-3.5 py-[11px] pr-11 rounded-lg outline-none placeholder-white/25 transition-all font-sans ${
                    confirm && confirm !== password 
                      ? 'border-red-400/50 focus:border-red-400/60' 
                      : 'border-white/10 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCpw(!showCpw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center"
                >
                  {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] mt-1 text-red-400 font-medium">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-[13px] text-red-400">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || password !== confirm || strength < 2}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-white/35 mt-6">
          Remember your password?{' '}
          <Link to="/sign" className="text-[#6ea8fe] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SetNewPassword;
