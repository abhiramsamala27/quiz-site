import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="fixed top-8 left-8 z-[100] pointer-events-none">
      <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-2.5 rounded-2xl scale-95 group-hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/20">
          <Zap size={24} className="text-white fill-white/20" />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="text-2xl font-black tracking-tighter text-[var(--text-main)] transition-all duration-300 drop-shadow-sm flex items-center gap-1">
            PERFORM <span className="text-blue-600 font-extrabold tracking-widest text-xl ml-1">MOCK</span>
          </span>
          <span className="text-[0.65rem] font-bold text-[var(--text-muted)] tracking-[0.3em] uppercase -mt-1 ml-1 opacity-80 group-hover:opacity-100 transition-opacity">Assessments</span>
        </div>
      </Link>
    </div>

  );
};

export default Logo;
