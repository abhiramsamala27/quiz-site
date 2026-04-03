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
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-10">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="glass-card p-12 md:p-16 rounded-[4rem] text-center max-w-3xl w-full border-white/20 relative shadow-2xl relative"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/40">
          <Trophy size={48} className="text-white fill-white/10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Your Quiz Result</h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">Hello, <span className="text-white font-bold">{user?.name}</span>. Here is your scorecard.</p>
        </motion.div>

        <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
             <svg className="w-full h-auto transform -rotate-90" viewBox="0 0 100 100">
               <circle 
                 cx="50" cy="50" r="45" 
                 fill="none" 
                 strokeWidth="8" 
                 className="stroke-white/5" 
               />
               <motion.circle 
                 cx="50" cy="50" r="45" 
                 fill="none" 
                 strokeWidth="8" 
                 strokeDasharray="283" 
                 strokeLinecap="round"
                 className="stroke-indigo-500"
                 initial={{ strokeDashoffset: 283 }}
                 animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{result.score}</span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">/ {result.totalQuestions}</span>
             </div>
          </div>

          <div className="text-left space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                 {feedback.icon}
              </div>
              <div>
                 <h3 className="text-xl font-bold mb-1">{feedback.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{feedback.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 glass p-4 rounded-2xl border-white/5">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Mail size={18} className="text-green-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full report sent to {user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
           <button 
             onClick={() => navigate('/')} 
             className="glass-card bg-white/10 py-5 px-12 rounded-[2rem] text-lg font-bold flex items-center justify-center gap-3 border border-white/10 hover:bg-white/20 transition-all max-w-sm w-full mx-auto"
           >
             <LayoutDashboard size={22} className="text-indigo-400" />
             Leave Dashboard
           </button>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 text-slate-500 font-medium">
        <Sparkles size={16} className="text-yellow-500" />
        <span className="text-sm">Global IQ Ranking: #4,291 among top elite participants</span>
      </div>
    </div>
  );
};

export default ResultPage;
