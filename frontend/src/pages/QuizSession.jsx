import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Send, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const QuizSession = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${baseURL}/api/quiz/questions`);
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.post(`${baseURL}/api/quiz/submit`, {
        name: user.name,
        email: user.email,
        answers: answers,
        timeTaken: timeTakenStr
      });
      localStorage.setItem('quiz_result', JSON.stringify(res.data));
      navigate('/result');
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-400 font-bold">Securing your session...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold">Failed to load questions</h2>
      <p className="text-slate-400 max-w-sm mt-2">Could not reach the high-speed server. Please try again later.</p>
    </div>
  );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timerColor = timeLeft > 120 ? 'text-green-400' : timeLeft > 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-10 px-4 relative">
      {/* Absolutely No Box - Floating Corner Elements */}
      {/* Absolutely No Box - Floating Corner Elements */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center md:justify-between items-center p-6 md:p-8 pointer-events-none">
        <div className="hidden md:block pointer-events-none invisible">
          {/* Spacer for Logo at top-left */}
        </div>

        <span className="font-black text-slate-400/80 text-sm md:text-base tracking-widest pointer-events-auto drop-shadow-xl uppercase">
          Assessment: <span className="text-white">{user.name}</span>
        </span>
        
        <div className={`font-mono text-xl md:text-2xl font-black pointer-events-auto drop-shadow-xl tracking-wider ${timerColor}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-10">
        {questions.map((q, qIndex) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            key={q._id}
            className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 text-indigo-500/5 select-none pointer-events-none">
              <span className="text-[8rem] font-black leading-none">{(qIndex + 1).toString().padStart(2, '0')}</span>
            </div>

            <h2 className="text-lg md:text-2xl font-bold mb-8 leading-snug relative z-10">
              <span className="text-indigo-400 mr-2">{qIndex + 1}.</span> {q.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {q.options.map((opt, i) => {
                const isSelected = answers[q._id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q._id, opt)}
                    className={`group relative p-6 text-left rounded-3xl transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'bg-indigo-500/20 border-indigo-500 ring-4 ring-indigo-500/10' 
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {opt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-16 flex flex-col items-center justify-center pb-20">
        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="gradient-btn px-12 py-6 rounded-[2.5rem] text-xl font-black flex items-center gap-4 shadow-2xl hover:scale-105 transition-all w-full md:w-auto"
        >
          {submitting ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} />}
          SUBMIT ASSESSMENT
        </button>
        <p className="text-slate-500 mt-6 font-medium text-sm">
          Please review all {questions.length} assessment items before final submission.
        </p>
      </div>
    </div>
  );
};

export default QuizSession;

