import { useMode } from '../context/ModeContext';
import { motion } from 'motion/react';
import { Code2, MoonStar, Sun, Video } from 'lucide-react';
import type { JSX } from 'react';

export const ModeToggle = () => {
  const { mode, setMode, theme, setTheme } = useMode();

  const activeModeGradient =
    mode === 'developer'
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
      : 'bg-gradient-to-r from-orange-500 to-rose-500';

  return (
    <>
      <motion.a
        href="#home"
        className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/85 px-2.5 py-1.5 shadow-xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        aria-label="TAN slash ten home"
      >
        <span className="pr-1 text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-100">TAN/10</span>
      </motion.a>

      <motion.div
        className="fixed left-1/2 top-4 z-50 w-[min(22rem,calc(100vw-8rem))] -translate-x-1/2 rounded-2xl border border-slate-300/60 bg-white/85 p-2 shadow-xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setMode('developer')}
            className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'developer' ? 'text-white' : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
            }`}
          >
            {mode === 'developer' && (
              <motion.span
                layoutId="activeMode"
                className={`absolute inset-0 rounded-lg ${activeModeGradient}`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Code2 className="relative z-10 h-4 w-4" />
            <span className="relative z-10">Developer</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('editor')}
            className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'editor' ? 'text-white' : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
            }`}
          >
            {mode === 'editor' && (
              <motion.span
                layoutId="activeMode"
                className={`absolute inset-0 rounded-lg ${activeModeGradient}`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Video className="relative z-10 h-4 w-4" />
            <span className="relative z-10">Editor</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/85 p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ThemeIconButton
          isActive={theme === 'light'}
          onClick={() => setTheme('light')}
          activeClassName="bg-gradient-to-r from-amber-400 to-orange-500"
          ariaLabel="Enable light mode"
          icon={<Sun className="h-4 w-4" />}
        />
        <ThemeIconButton
          isActive={theme === 'dark'}
          onClick={() => setTheme('dark')}
          activeClassName="bg-gradient-to-r from-slate-700 to-slate-900"
          ariaLabel="Enable dark mode"
          icon={<MoonStar className="h-4 w-4" />}
        />
      </motion.div>
    </>
  );
};

interface ThemeIconButtonProps {
  isActive: boolean;
  onClick: () => void;
  activeClassName: string;
  ariaLabel: string;
  icon: JSX.Element;
}

const ThemeIconButton = ({ isActive, onClick, activeClassName, ariaLabel, icon }: ThemeIconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        isActive
          ? 'text-white'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="activeTheme"
          className={`absolute inset-0 rounded-full ${activeClassName}`}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
    </button>
  );
};
