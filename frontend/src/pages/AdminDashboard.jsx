import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Search, Users, Trophy, Target, Clock,
  ChevronLeft, ChevronRight, Loader2, Database,
  LayoutDashboard, BookOpen, Plus, Trash2, Edit3, X, AlertTriangle, Save,
  ChevronDown, UploadCloud, DownloadCloud, FileText
} from 'lucide-react';
import api from '../utils/api';

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('results');
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('quiz_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  return (
    <div className="pb-24 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block lg:w-72 shrink-0 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-indigo-400 font-bold mb-2">
              <Database size={20} />
              <span>Assessment Portal</span>
            </div>
            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight text-left">Hiring</h1>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center justify-start gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'results' ? 'bg-indigo-500 text-[var(--text-main)] shadow-lg shadow-indigo-500/25' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)] glass-card border-transparent'
                }`}
            >
              <Users size={20} />
              Candidate Records
            </button>

            <div className="space-y-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all text-[var(--text-muted)] hover:text-[var(--text-main)] glass-card border-transparent mb-1`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-purple-400" />
                  <span>Master Tools</span>
                </div>
                <ChevronDown size={18} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-4"
                  >
                    <button
                      onClick={() => setActiveTab('questions')}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'questions' ? 'bg-purple-500 text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:bg-white/5'
                        }`}
                    >
                      <Database size={16} />
                      Manage Bank
                    </button>
                    <button
                      onClick={() => setActiveTab('bulk')}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'bulk' ? 'bg-purple-500 text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:bg-white/5'
                        }`}
                    >
                      <UploadCloud size={16} />
                      Bulk Import
                    </button>
                    <button
                      onClick={() => setActiveTab('export')}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'export' ? 'bg-purple-500 text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:bg-white/5'
                        }`}
                    >
                      <DownloadCloud size={16} />
                      Export Tools
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full glass-card hover:bg-red-500/10 hover:border-red-500/20 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group mt-10"
          >
            <LogOut size={20} className="text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
            <span className="text-[var(--text-muted)] group-hover:text-red-400 transition-colors">Sign Out</span>
          </button>
        </div>

        {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
        <div className="fixed bottom-0 left-0 w-full lg:hidden z-50 p-4 pb-6 bg-[#0f172a]/80 backdrop-blur-3xl border-t border-[var(--card-border)] flex items-center justify-around">
          <button onClick={() => setActiveTab('results')} className={`flex flex-col items-center gap-1 ${activeTab === 'results' ? 'text-indigo-400 font-bold scale-110' : 'text-[var(--text-muted)]'}`}>
            <LayoutDashboard size={24} />
            <span className="text-[10px]">Results</span>
          </button>
          <button onClick={() => setActiveTab('questions')} className={`flex flex-col items-center gap-1 ${activeTab === 'questions' ? 'text-purple-400 font-bold scale-110' : 'text-[var(--text-muted)]'}`}>
            <Database size={24} />
            <span className="text-[10px]">Manage</span>
          </button>
          <button onClick={() => setActiveTab('bulk')} className={`flex flex-col items-center gap-1 ${activeTab === 'bulk' ? 'text-purple-400 font-bold scale-110' : 'text-[var(--text-muted)]'}`}>
            <UploadCloud size={24} />
            <span className="text-[10px]">Import</span>
          </button>
          <button onClick={() => setActiveTab('export')} className={`flex flex-col items-center gap-1 ${activeTab === 'export' ? 'text-purple-400 font-bold scale-110' : 'text-[var(--text-muted)]'}`}>
            <DownloadCloud size={24} />
            <span className="text-[10px]">Export</span>
          </button>
          <button onClick={onLogout} className="flex flex-col items-center gap-1 text-red-500/80">
            <LogOut size={24} />
            <span className="text-[10px]">Exit</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'results' ? (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ResultsView token={token} />
              </motion.div>
            ) : activeTab === 'questions' ? (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <QuestionsView token={token} />
              </motion.div>
            ) : activeTab === 'bulk' ? (
              <motion.div key="bulk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <BulkImportView token={token} />
              </motion.div>
            ) : (
              <motion.div key="export" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ExportView token={token} />
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
  const [stats, setStats] = useState({ totalAttempts: 0, totalCandidates: 0, qualifiedCandidates: 0, highestScore: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, token]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/results?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data.results);
      setStats(res.data.stats);
      setPages(res.data.pages);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to connect to the recording server. Please check your connection.');
      setLoading(false);
    }
  };

  const clearAllResults = async () => {
    if (!window.confirm('Are you sure you want to permanently delete ALL candidate results? This action cannot be undone.')) return;
    try {
      await api.delete('/api/admin/results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResults();
      alert('All results have been cleared.');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        onLogout();
      } else {
        alert('Failed to clear results.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[var(--card-border)]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 w-full text-[var(--text-main)]">
            Overview Performance
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Review secure candidate records and performance metrics.</p>
        </div>
        <button
          onClick={clearAllResults}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all border border-red-500/10 hover:border-red-500/20"
        >
          <Trash2 size={18} />
          Clear All Records
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[var(--card-border)] flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-blue-500/20 rounded-xl md:rounded-2xl">
            <Users size={28} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Candidates</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--text-main)]">{stats.totalCandidates}</h3>
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[var(--card-border)] flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-purple-500/20 rounded-xl md:rounded-2xl">
            <Target size={28} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Qualified Leads</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--text-main)]">{stats.qualifiedCandidates}</h3>
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[var(--card-border)] flex items-center gap-4 md:gap-6 sm:col-span-2 md:col-span-1">
          <div className="p-3 md:p-4 bg-yellow-500/20 rounded-xl md:rounded-2xl">
            <Trophy size={28} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Highest Score</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--text-main)]">{stats.highestScore}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] border-[var(--card-border)] overflow-hidden">
        {/* Search */}
        <div className="p-4 md:p-8 border-b border-[var(--card-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 w-full text-[var(--text-main)]">
            Candidate Results
          </h2>
          <div className="relative w-full md:w-96 shrink-0">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full glass-input rounded-2xl py-3 pl-12 pr-6 outline-none text-[var(--text-main)] text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {error && (
          <div className="m-4 md:m-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-sm">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Table - Desktop only */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
              <p className="text-[var(--text-muted)] font-bold">Fetching results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <p className="text-[var(--text-muted)] font-bold mb-2">No results found.</p>
              <p className="text-sm text-[var(--text-muted)]">Share your quiz to start receiving candidates!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white/5 uppercase text-xs tracking-widest text-[var(--text-muted)] font-black">
                  <th className="p-6">Candidate</th>
                  <th className="p-6">Email</th>
                  <th className="p-6 text-center">Score</th>
                  <th className="p-6 flex items-center justify-center gap-2"><Clock size={16} /> Time</th>
                  <th className="p-6">Date</th>
                  <th className="p-6 text-right">CV</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-[var(--text-main)]">
                {results.map((res) => (
                  <tr key={res._id} className="border-b border-[var(--card-border)] hover:bg-white/5 transition-colors">
                    <td className="p-6 text-[var(--text-main)] font-bold">{res.name}</td>
                    <td className="p-6 text-[var(--text-muted)]">{res.email}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${res.score / res.totalQuestions >= 0.8 ? 'bg-green-500/20 text-green-400' :
                            res.score / res.totalQuestions >= 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                               'bg-red-500/20 text-red-400'
                           }`}>
                          {res.score} / {res.totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-[var(--text-muted)] text-center">{res.timeTaken}</td>
                    <td className="p-6 text-[var(--text-muted)] whitespace-nowrap">{formatDate(res.createdAt)}</td>
                    <td className="p-6 text-right">
                      {res.resume ? (
                        <a 
                          href={res.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <FileText size={14} />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] opacity-50 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Card View - Mobile only */}
        <div className="md:hidden space-y-4 p-4">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : results.map((res) => (
            <div key={res._id} className="glass-card p-5 rounded-2xl border-[var(--card-border)] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[var(--text-main)] tracking-tight">{res.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{res.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${res.score / res.totalQuestions >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                  {res.score}/{res.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--card-border)] text-[10px] font-bold text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Clock size={10} /> {res.timeTaken}</span>
                <span>{formatDate(res.createdAt)}</span>
              </div>
              {res.resume && (
                <div className="pt-2">
                  <a 
                    href={res.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black flex items-center justify-center gap-2"
                  >
                    <FileText size={12} />
                    VIEW CANDIDATE RESUME
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="p-4 md:p-6 border-t border-[var(--card-border)] flex justify-center items-center gap-3 md:gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="glass p-2 md:p-3 rounded-lg md:rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-[var(--card-border)] text-[var(--text-main)]"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-bold text-[var(--text-muted)] flex items-center gap-2">
              <span className="text-[var(--text-main)] bg-white/10 px-4 py-2 rounded-xl">{page}</span> of {pages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-[var(--card-border)] text-[var(--text-main)]"
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

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [page, token]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/questions?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions);
      setPages(res.data.pages);
      setLoading(false);
    } catch (err) {
      console.error('Fetch Questions Error:', err);
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

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/admin/questions/${editingId}`, formConfig, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Question updated successfully!');
      } else {
        await api.post('/api/admin/questions', formConfig, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Question added successfully!');
      }
      setIsFormOpen(false);
      fetchQuestions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Save Question Error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.delete(`/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg(res.data.message || 'Question deleted successfully!');
      fetchQuestions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete Question Error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to delete question.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-[var(--card-border)]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 w-full text-[var(--text-main)]">
            Question Bank
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage and update your quiz questions</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openFormForAdd}
            className="bg-purple-500 hover:bg-purple-600 text-[var(--text-main)] py-3 px-6 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus size={20} />
            Add Question
          </button>
        )}
      </div>

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-100 font-medium shadow-lg shadow-red-500/10">
          <AlertTriangle size={20} className="text-red-400" />
          {errorMsg}
        </motion.div>
      )}

      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/20 border border-green-500/50 p-4 rounded-2xl flex items-center gap-3 text-green-100 font-medium shadow-lg shadow-green-500/10">
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
                <h3 className="text-2xl font-black text-[var(--text-main)] flex items-center gap-3">
                  {editingId ? <Edit3 size={24} className="text-purple-400" /> : <Plus size={24} className="text-purple-400" />}
                  {editingId ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] bg-white/5 p-2 rounded-xl transition-colors hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitForm} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Question Text</label>
                  <textarea
                    rows="3"
                    className="w-full glass-input rounded-2xl py-4 px-5 outline-none text-[var(--text-main)] text-base focus:border-purple-500/50 focus:bg-white/5 transition-all"
                    placeholder="Enter the complete question here..."
                    value={formConfig.question}
                    onChange={(e) => setFormConfig({ ...formConfig, question: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formConfig.options.map((opt, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Option {idx + 1}</label>
                      <input
                        type="text"
                        className="w-full glass-input rounded-xl py-3 px-4 outline-none text-[var(--text-main)] focus:border-purple-500/50 focus:bg-white/5 transition-all"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Correct Answer</label>
                  <select
                    className="w-full glass-input rounded-2xl py-4 px-5 outline-none text-[var(--text-main)] text-base focus:border-purple-500/50 focus:bg-white/5 transition-all appearance-none cursor-pointer"
                    value={formConfig.correctAnswer}
                    onChange={(e) => setFormConfig({ ...formConfig, correctAnswer: e.target.value })}
                  >
                    <option value="" disabled className="text-[var(--text-muted)]">Select the correct option</option>
                    {formConfig.options.map((opt, idx) => (
                      opt.trim() && <option key={idx} value={opt} className="bg-slate-800 text-[var(--text-main)]">{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--card-border)]">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-[var(--text-main)] hover:text-[var(--text-main)] hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 rounded-xl font-bold text-[var(--text-main)] bg-purple-500 hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] border-[var(--card-border)] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 size={48} className="animate-spin text-purple-500 mb-4" />
              <p className="text-[var(--text-muted)] font-bold">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <p className="text-[var(--text-muted)] font-bold mb-2">No questions found.</p>
              <p className="text-sm text-[var(--text-muted)]">Add some questions to start the quiz!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/5 uppercase text-xs tracking-widest text-[var(--text-muted)] font-black">
                  <th className="p-6 w-1/2">Question</th>
                  <th className="p-6">Correct Answer</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-[var(--text-main)]">
                {questions.map((q) => (
                  <tr key={q._id} className="border-b border-[var(--card-border)] hover:bg-white/5 transition-colors">
                    <td className="p-6 text-[var(--text-main)]" title={q.question}>
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-500" /></div>
          ) : questions.map((q) => (
            <div key={q._id} className="glass-card p-5 rounded-2xl border-[var(--card-border)] space-y-4">
              <h4 className="font-bold text-[var(--text-main)] text-sm line-clamp-3 leading-relaxed">{q.question}</h4>
              <div className="flex justify-between items-center pt-3 border-t border-[var(--card-border)]">
                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Ans: {q.correctAnswer}</span>
                <div className="flex gap-2">
                  <button onClick={() => openFormForEdit(q)} className="p-2.5 bg-white/5 text-purple-400 rounded-lg"><Edit3 size={16} /></button>
                  <button onClick={() => deleteQuestion(q._id)} className="p-2.5 bg-white/5 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="p-4 md:p-6 border-t border-[var(--card-border)] flex justify-center items-center gap-3 md:gap-4 bg-black/10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="glass p-2 md:p-3 rounded-lg md:rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-[var(--card-border)] text-[var(--text-main)]"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-bold text-[var(--text-muted)] flex items-center gap-2">
              <span className="text-[var(--text-main)] bg-white/10 px-4 py-2 rounded-xl">{page}</span> of {pages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="glass p-3 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all border border-[var(--card-border)] text-[var(--text-main)]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

// --- BULK IMPORT VIEW ---
const BulkImportView = ({ token }) => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const downloadTemplate = () => {
    const headers = "question,option1,option2,option3,option4,correctAnswer\n";
    const example = "What is 2+2?,3,4,5,6,4\n";
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_template.csv';
    a.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return setError('CSV file is empty or missing data rows.');

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const hasAnswer = headers.includes('answer') || headers.includes('correctanswer');
      
      if (!hasAnswer) {
        return setError('Invalid CSV format. Header must include "answer" or "correctAnswer".');
      }

      const parsed = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

        if (cleanValues.length < 6) {
          errors.push(`Row ${i + 1}: Missing columns (Expected at least 6).`);
          continue;
        }

        const questionObj = {
          question: cleanValues[0],
          options: [cleanValues[1], cleanValues[2], cleanValues[3], cleanValues[4]],
          correctAnswer: cleanValues[5],
          category: 'General'
        };

        // Strict Validation
        if (!questionObj.question) errors.push(`Row ${i + 1}: Question text is empty.`);
        else if (questionObj.options.some(opt => !opt)) errors.push(`Row ${i + 1}: One or more options are empty.`);
        else if (!questionObj.correctAnswer) errors.push(`Row ${i + 1}: Correct answer is empty.`);
        else if (!questionObj.options.includes(questionObj.correctAnswer)) {
          errors.push(`Row ${i + 1}: Correct answer "${questionObj.correctAnswer}" must match one of the options exactly.`);
        } else {
          parsed.push(questionObj);
        }
      }

      if (errors.length > 0) {
        setError(errors.slice(0, 3).join(' | ') + (errors.length > 3 ? ` ...and ${errors.length - 3} more errors.` : ''));
        setFileData(null);
      } else if (parsed.length === 0) {
        setError('No valid questions found to import.');
        setFileData(null);
      } else {
        setFileData(parsed);
        setError('');
        setSuccess('');
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!fileData || fileData.length === 0) return setError('Please select a valid CSV file first.');
    setLoading(true);
    try {
      await api.post('/api/admin/questions/bulk', { questions: fileData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`${fileData.length} questions imported successfully!`);
      setFileData(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-[var(--card-border)] text-center max-w-2xl mx-auto w-full">
        <UploadCloud size={64} className="text-purple-400 mx-auto mb-6 shrink-0" />
        <h2 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-2">Bulk Import</h2>
        <p className="text-[var(--text-muted)] mb-8">Upload a CSV file to add multiple questions instantly.</p>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 cursor-pointer"
          />

          <button
            onClick={downloadTemplate}
            className="text-indigo-400 text-sm font-bold flex items-center gap-2 hover:underline"
          >
            <DownloadCloud size={16} />
            Download CSV Template
          </button>
        </div>

        {fileData && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <p className="text-green-400 font-bold">Ready to import {fileData.length} questions!</p>
          </div>
        )}

        {error && <p className="mt-4 text-red-400 font-bold">{error}</p>}
        {success && <p className="mt-4 text-green-400 font-bold">{success}</p>}

        <button
          onClick={handleUpload}
          disabled={loading || !fileData}
          className="w-full gradient-btn rounded-2xl py-5 mt-10 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          Start Import
        </button>
      </div>
    </div>
  );
};

// --- EXPORT VIEW ---
const ExportView = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/export-results', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Essential for binary/file data
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quiz_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export Error:', err);
      const errorMsg = err.response?.data?.message || 'The server failed to generate your export. Please ensure there is data to download.';
      alert(`Export Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-10 rounded-[2.5rem] border-[var(--card-border)] text-center max-w-2xl mx-auto">
        <FileText size={64} className="text-indigo-400 mx-auto mb-6" />
        <h2 className="text-3xl font-black text-[var(--text-main)] mb-2">Export Data</h2>
        <p className="text-[var(--text-muted)] mb-8">Generate a complete spreadsheet of all candidate performances.</p>

        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full gradient-btn rounded-2xl py-5 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <DownloadCloud size={24} />}
          Download All Results (.CSV)
        </button>

        <p className="mt-8 text-xs text-[var(--text-muted)] font-medium">
          Format: Microsoft Excel compatible CSV
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

