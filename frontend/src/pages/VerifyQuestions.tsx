import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, ArrowRight, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, questions } = (location.state as { email: string; questions: string[] }) || { email: '', questions: [] };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!email || !questions || questions.length === 0) {
      navigate('/forgot-password');
    }
  }, [email, questions, navigate]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError('');

    const newAnswers = [...answers, { question: currentQuestion, answer }];
    setAnswers(newAnswers);

    try {
      const response = await authAPI.verifyQuestions(email, newAnswers);

      if (response.verified) {
        navigate('/set-password', { state: { email } });
      } else if (response.locked) {
        setLocked(true);
        setRemainingMinutes(response.remainingMinutes || 15);
      } else {
        setIsCorrect(false);
        setShowResult(true);
        setError(response.message);
        
        setTimeout(() => {
          setShowResult(false);
          setAnswer('');
          
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setCurrentIndex(0);
            setAnswers([]);
          }
        }, 1500);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; locked?: boolean; remainingMinutes?: number } } };
        const data = axiosError.response?.data;
        
        if (data?.locked) {
          setLocked(true);
          setRemainingMinutes(data?.remainingMinutes || 15);
        } else {
          setError(data?.message || 'Verification failed');
        }
      } else {
        setError('Verification failed');
      }
      
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setAnswer('');
        setAnswers(answers);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !questions) {
    return null;
  }

  if (locked) {
    return (
      <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center px-5 py-12 relative overflow-hidden">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/35 -top-16 -right-16 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[400px]">
          <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 mx-auto mb-6">
              <Clock size={24} color="#ef4444" />
            </div>
            
            <h1 className="text-[22px] font-bold text-white mb-2">Account Locked</h1>
            <p className="text-[13.5px] text-white/45 mb-4">
              Too many failed attempts. Please try again in {remainingMinutes} minutes.
            </p>
            
            <Link 
              to="/sign" 
              className="inline-flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 px-6 rounded-lg hover:bg-[#ddeaff] transition-all"
            >
              Back to Sign In
            </Link>
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

        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[14px]">Back</span>
        </Link>

        <div className="bg-[#112055]/55 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md">

          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#6ea8fe]/10 border border-[#6ea8fe]/20 mx-auto mb-6">
            <Shield size={24} color="#6ea8fe" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-[22px] font-bold text-white mb-2">Verify Your Identity</h1>
            <p className="text-[13.5px] text-white/45">
              Answer at least 2 of 3 security questions correctly
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {questions.map((_, idx) => {
              const isAnswered = answers.some(a => a.question === questions[idx]);
              const isCurrent = idx === currentIndex;
              return (
                <div 
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isAnswered 
                      ? 'bg-green-400' 
                      : isCurrent 
                        ? 'bg-[#6ea8fe] animate-pulse' 
                        : 'bg-white/20'
                  }`}
                />
              );
            })}
          </div>

          <div className="mb-4">
            <p className="text-[13px] text-white/50 mb-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <h2 className="text-[16px] font-semibold text-white">
              {currentQuestion}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                disabled={loading || showResult}
                autoFocus
                className={`w-full bg-white/[0.05] border text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 transition-all font-sans ${
                  showResult 
                    ? isCorrect 
                      ? 'border-green-400/50 bg-green-500/10' 
                      : 'border-red-400/50 bg-red-500/10'
                    : 'border-white/10 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05'
                }`}
              />
            </div>

            {showResult && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                isCorrect 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {isCorrect ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
                <p className={`text-[13px] ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct!' : error || 'Incorrect'}
                </p>
              </div>
            )}

            {correctCount >= 2 && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-[13px] text-green-400 text-center">
                  Verification successful! Redirecting...
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !answer.trim() || showResult}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : showResult ? (
                <ArrowRight size={16} />
              ) : (
                'Submit Answer'
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 p-4 bg-[#112055]/30 border border-white/[0.05] rounded-xl">
          <p className="text-[12px] text-white/40 text-center">
            Answer 2 questions correctly to reset your password. {3 - answers.filter(a => questions.includes(a.question)).length} attempt(s) remaining.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyQuestions;
