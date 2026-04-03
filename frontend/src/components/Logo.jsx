import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="fixed top-6 left-6 z-[60] pointer-events-none">
      <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-indigo-500/20">
          <Zap size={22} className="text-white fill-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 group-hover:to-white transition-all duration-300 drop-shadow-sm">
          QuizApp <span className="text-indigo-400">⚡</span>
        </span>
      </Link>
    </div>
  );
};

export default Logo;
