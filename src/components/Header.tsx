import React, { useRef } from 'react';
import {
  Sun,
  Moon,
  Download,
  Upload,
  Monitor,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppStateData, exportBackup } from '../utils/storage';

interface HeaderProps {
  appState: AppStateData;
  onImportBackup: (data: AppStateData) => void;
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  currentUser: User | null;
  isSyncing: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appState,
  onImportBackup,
  theme,
  onThemeChange,
  currentUser,
  isSyncing,
  onSignIn,
  onSignOut,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onImportBackup({
            done: parsed.done || {},
            mocks: Array.isArray(parsed.mocks) ? parsed.mocks : [],
            errors: Array.isArray(parsed.errors) ? parsed.errors : [],
            cards: Array.isArray(parsed.cards) ? parsed.cards : [],
            board: Array.isArray(parsed.board) ? parsed.board : [],
          });
          alert('Backup restored successfully!');
        }
      } catch (err) {
        alert('Invalid backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cycleTheme = () => {
    if (theme === 'light') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('auto');
    else onThemeChange('light');
  };

  return (
    <header className="relative z-10 border-b border-[var(--line)] bg-[var(--paper)]/85 backdrop-blur-md sticky top-0 transition-colors">
      <div className="max-w-[1180px] mx-auto px-[22px] py-3.5 flex flex-wrap justify-between items-center gap-3 text-[0.92rem] text-[var(--muted)]">
        {/* Brand */}
        <b className="text-[var(--ink)] font-serif-fraunces italic font-normal text-[1.18rem] flex items-center">
          <span className="moon-icon" aria-hidden="true" />
          Study system: JEE Main + CBSE Class 12 Maths
        </b>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Cloud Sync Status / Auth */}
          <div className="flex items-center gap-2 bg-[var(--sheet)] border border-[var(--line)] rounded-full px-3 py-1.5 text-xs text-[var(--ink)] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[var(--ink)] font-medium flex items-center gap-1.5" title="Real-time Cloud Sync Active across all browsers and devices">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Cloud Synced</span>
            </span>

            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-[var(--line)]">
                <span className="font-medium text-[var(--muted)] truncate max-w-[110px]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors p-0.5 cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="ml-1 text-[var(--graphite)] hover:underline font-semibold cursor-pointer pl-1 border-l border-[var(--line)]"
                title="Sign in with Google (optional)"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={cycleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[var(--line)] text-xs font-medium hover:bg-[var(--line)] transition-colors text-[var(--ink)] cursor-pointer"
            title={`Theme mode: ${theme}. Click to change.`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto</span>
              </>
            )}
          </button>

          {/* Backup controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => exportBackup(appState)}
              className="p-1.5 rounded-full border border-[var(--line)] hover:bg-[var(--line)] text-[var(--ink)] transition-colors cursor-pointer"
              title="Download backup JSON file"
              aria-label="Download backup JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-full border border-[var(--line)] hover:bg-[var(--line)] text-[var(--ink)] transition-colors cursor-pointer"
              title="Restore from JSON backup file"
              aria-label="Restore from JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
