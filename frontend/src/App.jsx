import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import QuizSession from './pages/QuizSession';
import ResultPage from './pages/ResultPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Logo from './components/Logo';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('quiz_user');
    return saved ? JSON.parse(saved) : null;
  });

  const location = useLocation();

  const handleStartQuiz = (userData) => {
    setUser(userData);
    localStorage.setItem('quiz_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('quiz_admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 relative">
      <ThemeToggle />
      <Logo />
      <main className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        <Routes>
          <Route path="/" element={<Home onStart={handleStartQuiz} />} />
          <Route path="/quiz" element={<QuizSession user={user} />} />
          <Route path="/result" element={<ResultPage user={user} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
        </Routes>
      </main>
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

export default App;
