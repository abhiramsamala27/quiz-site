import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Zap, ShieldCheck } from 'lucide-react';

const Home = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide your name and email.');
      return;
    }
    setLoading(true);
    onStart(formData);
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-5 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-[420px] border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="bg-indigo-500/10 p-4 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-indigo-400 fill-indigo-400/20" />
          </div>

          <h1 className="text-xl md:text-3xl font-black mb-6 md:mb-8 tracking-tight text-[var(--text-main)]">
            Mock Assessment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 text-left">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-bold text-[var(--text-muted)] ml-1">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full glass-input rounded-2xl py-4 pl-12 pr-6 outline-none text-[var(--text-main)] text-lg transition-all focus:bg-white/10"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-bold text-[var(--text-muted)] ml-1">Work Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full glass-input rounded-2xl py-4 pl-12 pr-6 outline-none text-[var(--text-main)] text-lg transition-all focus:bg-white/10"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs md:text-sm font-bold animate-pulse text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full gradient-btn rounded-xl md:rounded-2xl py-3 md:py-4 text-base md:text-lg font-bold flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/25 min-h-[44px] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Begin Now 🚀'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex justify-center">
            <Link 
              to="/admin/login" 
              className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-indigo-500 transition-colors group"
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
