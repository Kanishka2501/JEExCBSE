import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  CloudCheck,
  AlertTriangle,
  RotateCcw,
  Check,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ExamSettings, JEEXAppState } from '../types';
import { exportJEEXBackup } from '../utils/storage';

interface SettingsViewProps {
  settings: ExamSettings;
  fullState: JEEXAppState;
  onUpdateSettings: (newSettings: ExamSettings) => void;
  onImportBackup: (imported: JEEXAppState) => void;
  onResetCycle: () => void;
  isCloudSynced: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  fullState,
  onUpdateSettings,
  onImportBackup,
  onResetCycle,
  isCloudSynced,
}) => {
  const [targetHours, setTargetHours] = useState(settings.dailyTargetHours || 8);
  const [minHours, setMinHours] = useState(settings.minimumProductiveTarget || 7);
  const [jee1Date, setJee1Date] = useState(settings.jee1Date || '2027-01-22');
  const [jee2Date, setJee2Date] = useState(settings.jee2Date || '2027-04-06');
  const [cbseDate, setCbseDate] = useState(settings.cbseMathsDate || '2027-03-01');
  const [syllabusTargetDate, setSyllabusTargetDate] = useState(settings.syllabusTargetDate || '2027-01-05');

  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: ExamSettings = {
      ...settings,
      dailyTargetHours: Number(targetHours),
      minimumProductiveTarget: Number(minHours),
      jee1Date,
      jee2Date,
      cbseMathsDate: cbseDate,
      syllabusTargetDate,
    };

    onUpdateSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings && parsed.chapters) {
          onImportBackup(parsed);
          alert('Backup successfully imported and synchronized!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">System Settings & Preparation Cycle</h1>
            <p className="text-xs text-slate-400">
              Configure targets, examination dates, cloud sync, and data backups
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Targets & Exam Dates Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-5">
          {/* Target Hours */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Daily High-Intensity Study Targets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Target Net Study Hours (Daily)
                </label>
                <div className="flex gap-2">
                  {[8, 10, 12].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTargetHours(h)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        targetHours === h
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {h} Hours {h === 8 ? '(Adj)' : h === 10 ? '(Std)' : '(Lock)'}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="4"
                  max="16"
                  step="0.5"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400">
                  Net focused study hours only. Meaningless screen time or breaks do not count.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Minimum Productive Baseline (Daily)
                </label>
                <input
                  type="number"
                  min="4"
                  max="10"
                  step="0.5"
                  value={minHours}
                  onChange={(e) => setMinHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400">
                  Standard baseline: 7.0 focused hours. Falling below this triggers a backlog recovery flag.
                </p>
              </div>
            </div>
          </div>

          {/* Exam Dates */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>Mandatory Milestones & Exam Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Preparation Start Date (Cycle Day 01)
                </label>
                <input
                  type="text"
                  disabled
                  value={settings.prepStartDate}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-violet-400 font-bold opacity-80 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">Fixed to 10 November 2026 (Day 01).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-300">
                  Internal Syllabus Target Finish
                </label>
                <input
                  type="date"
                  value={syllabusTargetDate}
                  onChange={(e) => setSyllabusTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400">Target to finish syllabus before January JEE.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  JEE Main 2027 Session 1
                </label>
                <input
                  type="date"
                  value={jee1Date}
                  onChange={(e) => setJee1Date(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  CBSE Maths Improvement Exam
                </label>
                <input
                  type="date"
                  value={cbseDate}
                  onChange={(e) => setCbseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">
                  JEE Main 2027 Session 2
                </label>
                <input
                  type="date"
                  value={jee2Date}
                  onChange={(e) => setJee2Date(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 font-bold">
                {savedNotice && '✓ Settings saved and synced!'}
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:opacity-90"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>

        {/* Right Col: Cloud Sync, Backup, Reset */}
        <div className="space-y-5">
          {/* Cloud Sync Status */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudCheck className="w-4 h-4 text-emerald-400" />
              <span>Universal Cloud Sync</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your preparation command centre is backed by real-time Firestore synchronization. Progress, chapters, timers, and error logs are instantly accessible across your phone, tablet, and desktop browsers simultaneously.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Browser Live Link Connected</span>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Data Protection & Backup</span>
            </h3>
            <p className="text-xs text-slate-400">
              Download complete preparation archives to your local drive or import an existing snapshot.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => exportJEEXBackup(fullState)}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JEE-X Backup (JSON)</span>
              </button>

              <label className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-violet-400" />
                <span>Import Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset / Fresh Cycle */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Reset Preparation Cycle</span>
            </h3>
            <p className="text-xs text-slate-400">
              Reset all chapters, daily tasks, and test logs back to a pristine Day 01 state starting 10 November 2026.
            </p>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs font-bold border border-rose-500/40 cursor-pointer"
              >
                Reset Cycle to Day 01
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-300 font-bold">
                  Are you absolutely certain? This will reset all current session logs.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmReset(false);
                      onResetCycle();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
