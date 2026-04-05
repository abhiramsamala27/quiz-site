import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Mail, CheckCircle, Star, Sparkles, LayoutDashboard } from 'lucide-react';

const ResultPage = ({ user }) => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedResult = localStorage.getItem('quiz_result');
    if (!savedResult) {
      navigate('/');
      return;
    }
    setResult(JSON.parse(savedResult));
  }, [navigate]);

  if (!result) return null;

  const percentage = (result.score / result.totalQuestions) * 100;
  
  const getFeedback = () => {
    if (percentage >= 80) return { title: 'Excellent Performance!', color: 'bg-green-500', icon: <Star className="text-yellow-400" />, desc: 'You have mastered the subject matter flawlessly. Keep up the high standard!' };
    if (percentage >= 50) return { title: 'Well Done!', color: 'bg-blue-500', icon: <CheckCircle className="text-blue-400" />, desc: 'You have a good grasp of the basics. A bit more study and youll be perfect.' };
    return { title: 'Keep Practicing!', color: 'bg-red-500', icon: <RefreshCw className="text-red-400" />, desc: 'Do not be discouraged. Use this as a learning opportunity and try again.' };
  };

  const feedback = getFeedback();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-5 md:p-16 rounded-[1.5rem] md:rounded-[4rem] text-center max-w-4xl w-full border-[var(--card-border)] relative shadow-2xl"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-3xl shadow-2xl">
          <Trophy size={48} className="text-white fill-white/10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 md:mt-8"
        >
          <h1 className="text-2xl md:text-6xl font-black mb-3 md:mb-4 tracking-tight text-[var(--text-main)]">Assessment Result</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-xl font-bold">Hello, <span className="text-blue-600">{user?.name}</span>. Here is your scorecard.</p>
        </motion.div>

        <div className="my-8 md:my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-left">
          <div className="relative max-w-[240px] mx-auto w-full">
             <svg className="w-full h-auto transform -rotate-90" viewBox="0 0 100 100">
               <circle 
                 cx="50" cy="50" r="45" 
                 fill="none" 
                 strokeWidth="10" 
                 className="stroke-[var(--card-border)]" 
               />
               <motion.circle 
                 cx="50" cy="50" r="45" 
                 fill="none" 
                 strokeWidth="10" 
                 strokeDasharray="283" 
                 strokeLinecap="round"
                 className="stroke-blue-500"
                 initial={{ strokeDashoffset: 283 }}
                 animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-[var(--text-main)]">{result.score}</span>
                <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">/ {result.totalQuestions}</span>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-[var(--input-bg)] p-4 md:p-6 rounded-2xl border border-[var(--card-border)]">
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                 {feedback.icon}
              </div>
              <div>
                 <h3 className="text-lg md:text-xl font-bold mb-1 text-[var(--text-main)]">{feedback.title}</h3>
                 <p className="text-[var(--text-main)] text-xs md:text-sm font-medium leading-relaxed">{feedback.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="bg-green-500 p-2 rounded-lg">
                <Mail size={18} className="text-white" />
              </div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                Full report sent to {user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
           <button 
             onClick={() => navigate('/')} 
             className="gradient-btn py-3 md:py-5 px-6 md:px-12 rounded-xl md:rounded-[2rem] text-base md:text-lg font-bold flex items-center justify-center gap-3 w-full md:w-auto min-h-[44px]"
           >
             <LayoutDashboard size={20} className="md:w-[22px] md:h-[22px]" />
             Leave Dashboard
           </button>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-3 text-[var(--text-muted)] font-bold text-sm tracking-widest uppercase">
        <Sparkles size={20} className="text-yellow-500" />
        Assessment Validated via Secure Channel
      </div>
    </div>

  );
};

export default ResultPage;
