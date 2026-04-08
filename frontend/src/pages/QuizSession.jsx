import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Send, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const QuizSession = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await api.get('/api/quiz/questions');
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Could not reach the high-speed server. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();

    const startTime = Date.now();
    const endTime = startTime + 300000;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.round((endTime - now) / 1000);
      
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(timerRef.current);
        autoSubmitRoute();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [user, navigate]);

  const autoSubmitRoute = () => {
    if (!submitting) {
      handleSubmit(true);
    }
  };

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const formatTimeToken = (timeUsedInSeconds) => {
    const mins = Math.floor(timeUsedInSeconds / 60);
    const secs = timeUsedInSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSubmit = async (isAuto = false) => {
    if (submitting) return;
    if (!isAuto && Object.keys(answers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setSubmitting(true);
    clearInterval(timerRef.current);
    
    const timeUsed = 300 - timeLeft;
    const timeTakenStr = formatTimeToken(timeUsed);

    try {
      const res = await api.post('/api/quiz/submit', {
        name: user.name,
        email: user.email,
        answers: answers,
        questionIds: questions.map(q => q._id),
        timeTaken: timeTakenStr,
        resume: user.resume // Include uploaded CV
      });
      localStorage.setItem('quiz_result', JSON.stringify(res.data));
      navigate('/result');
    } catch (err) {
      console.error(err);
      setError('Submission failed. Your internet might be unstable. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
      <p className="text-[var(--text-main)] font-bold text-xl drop-shadow-sm">Securing your session...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle size={48} className="text-[var(--text-muted)] mb-4" />
      <h2 className="text-2xl font-black text-[var(--text-main)]">Failed to load questions</h2>
      <p className="text-[var(--text-muted)] max-w-sm mt-3 font-medium">{error || 'Could not reach the high-speed server. Please try again later.'}</p>
    </div>
  );


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resetAnswers = () => {
    if (window.confirm('Are you sure you want to reset all answers?')) {
      setAnswers({});
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto pb-20 pt-4 md:pt-8 w-[100%]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl md:rounded-[1.5rem] shadow-[var(--shadow)] overflow-hidden w-full"
      >
        {/* Header Section (Stacked on mobile, horizontal on desktop) */}
        <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <h1 className="text-lg md:text-xl font-bold leading-tight">Employee Attitude Test</h1>
            <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs md:text-sm text-white/90">
              <span>Candidate: <b className="text-white">{user.name}</b></span>
              <span className="hidden md:inline">•</span>
              <span><b className="text-white">{user.email}</b></span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-between w-full md:w-auto tracking-wide">
            <span>Time Left:</span>
            <span className="font-mono ml-2 text-base">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* Questions Body */}
        <div className="w-full">
          {questions.map((q, qIndex) => (
            <div key={q._id} className="p-4 md:p-8 border-b border-[var(--footer-border)] w-full">
              <div className="bg-[var(--badge-bg)] text-[var(--badge-text)] px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest inline-block mb-3 md:mb-5">
                Question {qIndex + 1} of {questions.length}
              </div>
              <h2 className="text-base md:text-xl font-bold text-[var(--text-main)] mb-4 md:mb-6 leading-snug md:leading-relaxed">
                {q.question}
              </h2>

              <div className="flex flex-col gap-2.5 md:gap-3 w-full">
                {q.options.map((opt, i) => {
                  const isSelected = answers[q._id] === opt;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(q._id, opt)}
                      className={`
                        w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border-[1.5px] cursor-pointer transition-all duration-200 select-none min-h-[48px] md:min-h-[56px]
                        ${isSelected 
                          ? 'bg-[var(--selected-bg)] border-blue-500 shadow-sm shadow-blue-500/10' 
                          : 'bg-[var(--input-bg)] border-[var(--input-border)] hover:border-blue-400 hover:bg-[var(--footer-bg)]'}
                      `}
                    >
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"></div>}
                      </div>
                      <span className={`text-sm md:text-base font-semibold leading-snug w-full ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-[var(--text-main)]'}`}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-t border-red-100 flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        {/* Footer Actions */}
        <footer className="bg-[var(--footer-bg)] p-4 md:p-8 flex flex-col md:flex-row justify-center gap-3 md:gap-4 w-full">
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 md:px-12 py-3.5 md:py-4 rounded-full font-extrabold text-sm md:text-base shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT ASSESSMENT'}
          </button>
          <button
            onClick={resetAnswers}
            disabled={submitting}
            className="w-full md:w-auto bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)] px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base transition-colors min-h-[48px]"
          >
            RESET
          </button>
        </footer>
      </motion.div>
      
      <p className="text-center text-[var(--text-muted)] mt-8 text-sm font-medium">
        Please ensure all questions are answered before submitting.
      </p>
    </div>
  );
};


export default QuizSession;

