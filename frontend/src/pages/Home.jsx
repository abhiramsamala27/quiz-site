import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Zap, ShieldCheck } from 'lucide-react';

const Home = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide your name and email.');
      return;
    }
    onStart(formData);
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 md:p-14 rounded-[3rem] w-full max-w-lg border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="bg-indigo-500/10 p-4 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-indigo-400 fill-indigo-400/20" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight text-white">
            Start Quiz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full glass-input rounded-2xl py-4 pl-12 pr-6 outline-none text-white text-lg transition-all focus:bg-white/10"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full glass-input rounded-2xl py-4 pl-12 pr-6 outline-none text-white text-lg transition-all focus:bg-white/10"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm font-medium animate-pulse text-center">{error}</p>}

            <button type="submit" className="w-full gradient-btn rounded-2xl py-5 text-lg font-bold flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/25">
              Start Quiz 🚀
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
            <Link 
              to="/admin/login" 
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors group"
            >
              <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
              Admin Access
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
