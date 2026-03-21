import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [locked, setLocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.questions) {
        navigate('/verify-questions', { 
          state: { 
            email, 
            questions: response.questions 
          } 
        });
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; locked?: boolean; remainingMinutes?: number } } };
        const data = axiosError.response?.data;
        
        if (data?.locked) {
          setLocked(true);
          setRemainingMinutes(data?.remainingMinutes || 15);
          setError(data?.message || 'Account locked');
        } else {
          setError(data?.message || 'Something went wrong');
        }
      } else {
        setError('Something went wrong');
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

        <Link to="/sign" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[14px]">Back to Sign In</span>
        </Link>

        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#6ea8fe]/10 border border-[#6ea8fe]/20 mx-auto mb-6">
            <KeyRound size={24} color="#6ea8fe" />
          </div>

          <div className="text-center mb-7">
            <h1 className="text-[22px] font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-[13.5px] text-white/45">
              Enter your email and we'll help you reset your password using your security questions.
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-[14px] text-green-400">
                  If an account exists with this email, you will be able to reset your password using your security questions.
                </p>
              </div>
              <Link 
                to="/sign" 
                className="inline-flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 px-6 rounded-lg hover:bg-[#ddeaff] transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          ) : locked ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-[14px] text-red-400">
                  {error}
                </p>
              </div>
              <p className="text-[13px] text-white/50 mb-4">
                Please wait {remainingMinutes} minutes before trying again.
              </p>
              <Link 
                to="/sign" 
                className="inline-flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 px-6 rounded-lg hover:bg-[#ddeaff] transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] pl-11 rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              {error && !locked && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-[13px] text-red-400">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Continue'
                )}
                {loading ? 'Checking...' : ''}
              </button>
            </form>
          )}
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

export default ForgotPassword;
