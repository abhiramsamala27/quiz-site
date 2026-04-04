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
      <p className="text-[var(--text-main)] font-bold text-xl drop-shadow-sm">Securing your session...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle size={48} className="text-[var(--text-muted)] mb-4" />
      <h2 className="text-2xl font-black text-[var(--text-main)]">Failed to load questions</h2>
      <p className="text-[var(--text-muted)] max-w-sm mt-3 font-medium">Could not reach the high-speed server. Please try again later.</p>
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
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="quiz-card"
      >
        {/* Header */}
        <header className="quiz-header">
          <h1>Employee Attitude Test</h1>
          <div className="time-badge">
            Time Left: <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* User Info Bar */}
        <div className="user-info-bar">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <span>Name: <b>{user.name}</b></span>
            <span>Email: <b>{user.email}</b></span>
          </div>
          <span className="hidden md:inline">Questions: <b>{questions.length}</b></span>
        </div>

        {/* Questions */}
        <div className="quiz-body">
          {questions.map((q, qIndex) => (
            <div key={q._id} className="question-container">
              <div className="question-badge">Question {qIndex + 1}</div>
              <h2 className="question-text">{q.question}</h2>

              <div className="options-list">
                {q.options.map((opt, i) => {
                  const isSelected = answers[q._id] === opt;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(q._id, opt)}
                      className={`option-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="radio-circle">
                        <div className="radio-inner"></div>
                      </div>
                      <span className="option-label">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="quiz-footer">
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="submit-test-btn"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT TEST'}
          </button>
          <button
            onClick={resetAnswers}
            disabled={submitting}
            className="reset-test-btn"
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

