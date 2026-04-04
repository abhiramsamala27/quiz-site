import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('quiz_dark_mode');
        return saved === 'true';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('quiz_dark_mode', darkMode);
    }, [darkMode]);

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="fixed bottom-8 right-8 z-[100] p-4 rounded-2xl glass-card flex items-center justify-center shadow-2xl border-indigo-500/20 hover:border-indigo-500/50 transition-all group"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {darkMode ? (
                <Sun className="text-yellow-400 group-hover:rotate-45 transition-transform duration-500" size={24} />
            ) : (
                <Moon className="text-indigo-400 group-hover:-rotate-12 transition-transform duration-500" size={24} />
            )}
        </motion.button>
    );
};

export default ThemeToggle;
