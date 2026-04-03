import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('quiz_admin_token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-14 rounded-[3rem] w-full max-w-lg border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="bg-white/5 p-4 rounded-3xl w-16 h-16 flex items-center justify-center mb-8 mx-auto self-center">
            <Lock size={32} className="text-white fill-white/10" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-center mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 text-center mb-10 font-medium">Verify your credentials to manage the platform.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Admin Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="admin@quizapp.com"
                  className="w-full glass-input rounded-2xl py-4 pl-14 pr-6 outline-none text-white transition-all text-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Security Key or Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full glass-input rounded-2xl py-4 pl-14 pr-6 outline-none text-white transition-all text-lg"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 glass bg-red-500/10 p-4 rounded-2xl text-red-400 text-sm font-semibold border-red-500/20"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full gradient-btn py-5 rounded-[2rem] text-lg font-bold flex items-center justify-center gap-3 shadow-xl group"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                  Authenticate Access
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 text-sm italic">
            This workspace is monitored for security and compliance.
          </p>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
            >
              ← Candidate Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
