import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Search, Users, Trophy, Target, Clock,
  ChevronLeft, ChevronRight, Loader2, Database,
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, X, AlertTriangle, Save
} from 'lucide-react';
import axios from 'axios';

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('results');
  const navigate = useNavigate();
  const token = localStorage.getItem('quiz_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  return (
    <div className="py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-indigo-400 font-bold mb-2">
              <Database size={20} />
              <span>Control Center</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin</h1>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('results')}
              className={`flex items-center justify-start gap-3 p-4 rounded-2xl font-bold transition-all ${
                activeTab === 'results' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:bg-white/5 hover:text-white glass-card border-transparent'
              }`}
            >
              <LayoutDashboard size={20} />
              Results
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`flex items-center justify-start gap-3 p-4 rounded-2xl font-bold transition-all ${
                activeTab === 'questions' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:bg-white/5 hover:text-white glass-card border-transparent'
              }`}
            >
              <BookOpen size={20} />
              Manage Questions
            </button>
          </div>

          <button 
            onClick={onLogout}
            className="w-full glass-card hover:bg-red-500/10 hover:border-red-500/20 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group mt-10"
          >
            <LogOut size={20} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            <span className="text-slate-500 group-hover:text-red-400 transition-colors">Sign Out</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'results' ? (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ResultsView token={token} />
              </motion.div>
            ) : (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <QuestionsView token={token} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
};

// --- RESULTS VIEW COMPONENT ---
const ResultsView = ({ token }) => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ totalAttempts: 0, avgScore: 0, highestScore: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, token]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseURL}/api/admin/results?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data.results);
      setStats(res.data.stats);
      setPages(res.data.pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-6 rounded-[2rem] border-white/10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 w-full text-white">
            Overview Performance
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review secure quiz attempts and candidate metrics.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] border-white/10 flex items-center gap-6">
          <div className="p-4 bg-blue-500/20 rounded-2xl">
            <Users size={32} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Attempts</p>
            <h3 className="text-3xl font-black text-white">{stats.totalAttempts}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] border-white/10 flex items-center gap-6">
          <div className="p-4 bg-purple-500/20 rounded-2xl">
            <Target size={32} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Average Score</p>
            <h3 className="text-3xl font-black text-white">{Math.round(stats.avgScore * 10) / 10 || 0}</h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] border-white/10 flex items-center gap-6">
          <div className="p-4 bg-yellow-500/20 rounded-2xl">
            <Trophy size={32} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Highest Score</p>
            <h3 className="text-3xl font-black text-white">{stats.highestScore}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden">
        {/* Search */}
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-3 w-full text-white">
            Candidate Results
          </h2>
          <div className="relative w-full md:w-96 shrink-0">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full glass-input rounded-2xl py-3 pl-12 pr-6 outline-none text-white text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
               <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
               <p className="text-slate-500 font-bold">Fetching results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
               <p className="text-slate-400 font-bold mb-2">No results found.</p>
               <p className="text-sm text-slate-500">Share your quiz to get attempts!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white/5 uppercase text-xs tracking-widest text-slate-400 font-black">
                  <th className="p-6">Candidate</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Score</th>
                  <th className="p-6 flex items-center gap-2"><Clock size={16} /> Time Taken</th>
                  <th className="p-6">Submission Date</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-300">
                {results.map((res) => (
                  <tr key={res._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 text-white font-bold">{res.name}</td>
                    <td className="p-6 text-slate-400">{res.email}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          res.score / res.totalQuestions >= 0.8 ? 'bg-green-500/20 text-green-400' :
                          res.score / res.totalQuestions >= 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {res.score} / {res.totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">{res.timeTaken}</td>
                    <td className="p-6 text-slate-400">{formatDate(res.createdAt || res.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="p-6 border-t border-white/10 flex justify-center items-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-white/10 text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-bold text-slate-400 flex items-center gap-2">
              <span className="text-white bg-white/10 px-4 py-2 rounded-xl">{page}</span> of {pages}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(pages, p + 1))} 
              disabled={page === pages}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-white/10 text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- QUESTIONS VIEW COMPONENT ---
const QuestionsView = ({ token }) => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formConfig, setFormConfig] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  useEffect(() => {
    fetchQuestions();
  }, [page, token]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.get(`${baseURL}/api/admin/questions?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions);
      setPages(res.data.pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...formConfig.options];
    newOptions[idx] = value;
    setFormConfig({ ...formConfig, options: newOptions });
  };

  const openFormForAdd = () => {
    setEditingId(null);
    setFormConfig({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    setErrorMsg('');
    setIsFormOpen(true);
  };
  
  const openFormForEdit = (q) => {
    setEditingId(q._id);
    setFormConfig({ question: q.question, options: [...q.options], correctAnswer: q.correctAnswer });
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    // Validation
    if (!formConfig.question.trim()) return setErrorMsg('Question text is required.');
    if (formConfig.options.some(opt => !opt.trim())) return setErrorMsg('All 4 options must be filled.');
    if (!formConfig.correctAnswer) return setErrorMsg('Please select the correct answer.');
    if (!formConfig.options.includes(formConfig.correctAnswer)) return setErrorMsg('Correct answer must match one of the options exactly.');

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      if (editingId) {
        await axios.put(`${baseURL}/api/admin/questions/${editingId}`, formConfig, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Question updated successfully!');
      } else {
        await axios.post(`${baseURL}/api/admin/questions`, formConfig, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Question added successfully!');
      }
      setIsFormOpen(false);
      fetchQuestions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save question.');
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.delete(`${baseURL}/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg(res.data.message || 'Question deleted successfully!');
      fetchQuestions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-6 rounded-[2rem] border-white/10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 w-full text-white">
            Question Bank
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage and update your quiz questions</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={openFormForAdd}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus size={20} />
            Add Question
          </button>
        )}
      </div>

      {errorMsg && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-100 font-medium shadow-lg shadow-red-500/10">
          <AlertTriangle size={20} className="text-red-400" />
          {errorMsg}
        </motion.div>
      )}

      {successMsg && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-green-500/20 border border-green-500/50 p-4 rounded-2xl flex items-center gap-3 text-green-100 font-medium shadow-lg shadow-green-500/10">
          <Database size={20} className="text-green-400" />
          {successMsg}
        </motion.div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }} 
            animate={{ opacity: 1, height: 'auto', scale: 1 }} 
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border-purple-500/30 mb-6 bg-slate-900 shadow-2xl shadow-purple-500/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  {editingId ? <Edit3 size={24} className="text-purple-400" /> : <Plus size={24} className="text-purple-400" />}
                  {editingId ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-xl transition-colors hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitForm} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Question Text</label>
                  <textarea 
                    rows="3"
                    className="w-full glass-input rounded-2xl py-4 px-5 outline-none text-white text-base focus:border-purple-500/50 focus:bg-white/5 transition-all"
                    placeholder="Enter the complete question here..."
                    value={formConfig.question}
                    onChange={(e) => setFormConfig({...formConfig, question: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formConfig.options.map((opt, idx) => (
                     <div key={idx}>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Option {idx + 1}</label>
                       <input 
                         type="text" 
                         className="w-full glass-input rounded-xl py-3 px-4 outline-none text-white focus:border-purple-500/50 focus:bg-white/5 transition-all"
                         placeholder={`Option ${idx + 1}`}
                         value={opt}
                         onChange={(e) => handleOptionChange(idx, e.target.value)}
                       />
                     </div>
                  ))}
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Correct Answer</label>
                   <select 
                     className="w-full glass-input rounded-2xl py-4 px-5 outline-none text-white text-base focus:border-purple-500/50 focus:bg-white/5 transition-all appearance-none cursor-pointer"
                     value={formConfig.correctAnswer}
                     onChange={(e) => setFormConfig({...formConfig, correctAnswer: e.target.value})}
                   >
                     <option value="" disabled className="text-slate-500">Select the correct option</option>
                     {formConfig.options.map((opt, idx) => (
                       opt.trim() && <option key={idx} value={opt} className="bg-slate-800 text-white">{opt}</option>
                     ))}
                   </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/25"
                  >
                    <Save size={18} />
                    {editingId ? 'Save Changes' : 'Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <div className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
               <Loader2 size={48} className="animate-spin text-purple-500 mb-4" />
               <p className="text-slate-500 font-bold">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
               <p className="text-slate-400 font-bold mb-2">No questions found.</p>
               <p className="text-sm text-slate-500">Add some questions to start the quiz!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/5 uppercase text-xs tracking-widest text-slate-400 font-black">
                  <th className="p-6 w-1/2">Question</th>
                  <th className="p-6">Correct Answer</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-300">
                {questions.map((q) => (
                  <tr key={q._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 text-white" title={q.question}>
                      <div className="line-clamp-2">{q.question}</div>
                    </td>
                    <td className="p-6 text-green-400 font-bold" title={q.correctAnswer}>
                      <div className="line-clamp-1">{q.correctAnswer}</div>
                    </td>
                    <td className="p-6">
                       <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => openFormForEdit(q)}
                           className="p-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-colors border border-purple-500/10 hover:border-purple-500/30"
                           title="Edit Question"
                         >
                           <Edit3 size={18} />
                         </button>
                         <button 
                           onClick={() => deleteQuestion(q._id)}
                           className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/10 hover:border-red-500/30"
                           title="Delete Question"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="p-6 border-t border-white/10 flex justify-center items-center gap-4 bg-black/10">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-white/10 text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-bold text-slate-400 flex items-center gap-2">
              <span className="text-white bg-white/10 px-4 py-2 rounded-xl">{page}</span> of {pages}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(pages, p + 1))} 
              disabled={page === pages}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-white/10 text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
