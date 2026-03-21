import { useState, useEffect, useRef } from 'react';
import { UserPlus, Eye, EyeOff, Lock, Clock, Users, Loader2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';
import { SECURITY_QUESTIONS } from '../services/api';

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

interface SecurityQuestion {
  question: string;
  answer: string;
}

const SignUp = () => {
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const [showQuestionDropdowns, setShowQuestionDropdowns] = useState<boolean[]>([false, false, false]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowQuestionDropdowns([false, false, false]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inputClass = "w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans";
  const labelClass = "block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-1.5";

  const handleQuestionSelect = (index: number, question: string) => {
    const updated = [...securityQuestions];
    updated[index].question = question;
    setSecurityQuestions(updated);
    const dropdowns = [...showQuestionDropdowns];
    dropdowns[index] = false;
    setShowQuestionDropdowns(dropdowns);
  };

  const handleQuestionAnswer = (index: number, answer: string) => {
    const updated = [...securityQuestions];
    updated[index].answer = answer;
    setSecurityQuestions(updated);
  };

  const isQuestionSelected = (question: string, excludeIndex: number) => {
    return securityQuestions.some((sq, i) => i !== excludeIndex && sq.question === question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 2) {
      setError('Password is too weak');
      return;
    }

    const emptyQuestion = securityQuestions.some(sq => !sq.question || !sq.answer);
    if (emptyQuestion) {
      setError('Please select and answer all 3 security questions');
      return;
    }

    const uniqueQuestions = new Set(securityQuestions.map(sq => sq.question));
    if (uniqueQuestions.size !== 3) {
      setError('Please select 3 different security questions');
      return;
    }

    setLoading(true);

    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        securityQuestions: securityQuestions.map(sq => ({ question: sq.question, answer: sq.answer }))
      });
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Signup failed');
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-[#091325] flex items-start justify-center px-5 py-12 relative overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">

      <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/25 -bottom-16 -left-16 blur-[80px] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-[#6ea8fe]/06 -top-10 -right-10 blur-[80px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(110,168,254,1) 1px,transparent 1px),linear-gradient(90deg,rgba(110,168,254,1) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] overflow-hidden">

        <div className="flex items-center justify-center gap-2 mb-9">
          <span className="text-[20px]">🎬</span>
          <span className="text-[26px] font-black tracking-[1px] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            WatchWise
          </span>
        </div>

        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="mb-7">
            <h1 className="text-[22px] font-bold text-white mb-1.5">Create your account</h1>
            <p className="text-[13.5px] text-white/45">
              Already a member?{' '}
              <Link to="/sign" className="text-[#6ea8fe] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="John" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Doe" required className={inputClass} />
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass}>Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required className={inputClass} />
            </div>

            <div className="mb-4">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Create a strong password"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
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

            <div className="mb-4">
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showCpw ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat your password"
                  required
                  className={`${inputClass} pr-11 ${form.confirm && form.confirm !== form.password ? 'border-red-400/50 focus:border-red-400/60' : ''}`}
                />
                <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center">
                  {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-[11px] mt-1 text-red-400 font-medium">Passwords do not match</p>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClass}>Security Question 1</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...showQuestionDropdowns];
                    updated[0] = !updated[0];
                    setShowQuestionDropdowns(updated);
                  }}
                  className={`${inputClass} cursor-pointer text-left flex items-center justify-between`}
                >
                  <span className={securityQuestions[0].question ? 'text-white' : 'text-white/25'}>
                    {securityQuestions[0].question || 'Select a question'}
                  </span>
                  <ChevronDown size={16} className={`text-white/30 transition-transform ${showQuestionDropdowns[0] ? 'rotate-180' : ''}`} />
                </button>
                {showQuestionDropdowns[0] && (
                  <div className="absolute z-50 w-full mt-1 bg-[#0a1628] border border-white/10 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto">
                    {SECURITY_QUESTIONS.filter(q => !isQuestionSelected(q, 0)).map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuestionSelect(0, q)}
                        className="w-full text-left px-3.5 py-[11px] text-[14px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {securityQuestions[0].question && (
                <input
                  type="text"
                  value={securityQuestions[0].answer}
                  onChange={(e) => handleQuestionAnswer(0, e.target.value)}
                  placeholder="Your answer"
                  required
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>

            <div className="mb-4">
              <label className={labelClass}>Security Question 2</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...showQuestionDropdowns];
                    updated[1] = !updated[1];
                    setShowQuestionDropdowns(updated);
                  }}
                  className={`${inputClass} cursor-pointer text-left flex items-center justify-between`}
                >
                  <span className={securityQuestions[1].question ? 'text-white' : 'text-white/25'}>
                    {securityQuestions[1].question || 'Select a question'}
                  </span>
                  <ChevronDown size={16} className={`text-white/30 transition-transform ${showQuestionDropdowns[1] ? 'rotate-180' : ''}`} />
                </button>
                {showQuestionDropdowns[1] && (
                  <div className="absolute z-50 w-full mt-1 bg-[#0a1628] border border-white/10 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto">
                    {SECURITY_QUESTIONS.filter(q => !isQuestionSelected(q, 1)).map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuestionSelect(1, q)}
                        className="w-full text-left px-3.5 py-[11px] text-[14px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {securityQuestions[1].question && (
                <input
                  type="text"
                  value={securityQuestions[1].answer}
                  onChange={(e) => handleQuestionAnswer(1, e.target.value)}
                  placeholder="Your answer"
                  required
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>

            <div className="mb-4">
              <label className={labelClass}>Security Question 3</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...showQuestionDropdowns];
                    updated[2] = !updated[2];
                    setShowQuestionDropdowns(updated);
                  }}
                  className={`${inputClass} cursor-pointer text-left flex items-center justify-between`}
                >
                  <span className={securityQuestions[2].question ? 'text-white' : 'text-white/25'}>
                    {securityQuestions[2].question || 'Select a question'}
                  </span>
                  <ChevronDown size={16} className={`text-white/30 transition-transform ${showQuestionDropdowns[2] ? 'rotate-180' : ''}`} />
                </button>
                {showQuestionDropdowns[2] && (
                  <div className="absolute z-50 w-full mt-1 bg-[#0a1628] border border-white/10 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto">
                    {SECURITY_QUESTIONS.filter(q => !isQuestionSelected(q, 2)).map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuestionSelect(2, q)}
                        className="w-full text-left px-3.5 py-[11px] text-[14px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {securityQuestions[2].question && (
                <input
                  type="text"
                  value={securityQuestions[2].answer}
                  onChange={(e) => handleQuestionAnswer(2, e.target.value)}
                  placeholder="Your answer"
                  required
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-[13px] text-red-400">{error}</p>
              </div>
            )}

            <p className="text-[12px] text-white/35 leading-[1.6] mb-5">
              By creating an account you agree to our{' '}
              <span className="text-[#6ea8fe] font-medium cursor-pointer hover:underline">Terms of Service</span> and{' '}
              <span className="text-[#6ea8fe] font-medium cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} strokeWidth={2.5} />
              )}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="mt-7 flex flex-col gap-2.5">
          {[
            { Icon: Lock,  text: 'Your data is always safe and encrypted'  },
            { Icon: Clock, text: 'Free forever — no credit card required'  },
            { Icon: Users, text: 'Join 2M+ movie lovers worldwide'          },
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

export default SignUp;
