

import { useTheme } from './ThemeProvider';
import { Moon, Sun, Bell, User } from 'lucide-react';

export default function Header({ breadcrumb = [] }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumb.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-slate-300 font-medium">
                {item}
              </span>
              {idx < breadcrumb.length - 1 && (
                <span className="text-gray-400 dark:text-slate-600">/</span>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-slate-300" />
            )}
          </button>

          {/* Profile */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <User className="w-5 h-5 text-gray-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
