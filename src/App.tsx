import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ExecutionConsole } from './components/ExecutionConsole';
import { FileDiffViewer } from './components/FileDiffViewer';
import { FileTreeViewer } from './components/FileTreeViewer';
import { CliGuide } from './components/CliGuide';
import { StatusResponse } from './types';
import { LayoutDashboard, FileCode, FolderTree, Terminal, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'diffs' | 'tree' | 'cli'>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
      setIsCloning(data.isCloning);
    } catch (err) {
      console.error('Kunde inte hämta status:', err);
    }
  };

  const handleRunClone = async () => {
    setIsCloning(true);
    setNotification(null);
    try {
      const res = await fetch('/api/run-clone', { method: 'POST' });
      const data = await res.json();
      setIsCloning(false);
      fetchStatus();
      setRefreshTrigger((prev) => prev + 1);

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Kloning och konfigurering slutförd! Matt Pocock har exkluderats och Google Gemini Skills har integrerats i projektets huvudfil.',
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Kloningen stötte på ett problem: ' + (data.error || 'Okänt fel'),
        });
      }
    } catch (err: any) {
      setIsCloning(false);
      setNotification({
        type: 'error',
        message: 'Kunde inte kommunicera med servern: ' + err.message,
      });
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/download-zip';
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col">
      <Header
        status={status}
        isCloning={isCloning}
        onRunClone={handleRunClone}
        onDownloadZip={handleDownloadZip}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-stone-400 hover:text-stone-600 text-xs px-2 py-0.5 rounded"
            >
              Stäng
            </button>
          </div>
        )}

        {/* Top Key Metrics */}
        <StatsOverview status={status} />

        {/* Tab Navigation */}
        <div className="border-b border-stone-200 flex items-center gap-2 overflow-x-auto pb-px">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'dashboard'
                ? 'bg-white text-indigo-700 border-indigo-600'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Översikt & Exekvering</span>
          </button>

          <button
            id="tab-diffs"
            onClick={() => setActiveTab('diffs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'diffs'
                ? 'bg-white text-indigo-700 border-indigo-600'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-transparent'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Huvudfilskonfiguration & Diffs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
              AGENTS.md
            </span>
          </button>

          <button
            id="tab-tree"
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'tree'
                ? 'bg-white text-indigo-700 border-indigo-600'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-transparent'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Filutforskare & Källkod</span>
          </button>

          <button
            id="tab-cli"
            onClick={() => setActiveTab('cli')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'cli'
                ? 'bg-white text-indigo-700 border-indigo-600'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal & CLI-Guide</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'dashboard' && (
          <ExecutionConsole
            logs={status?.logs || []}
            isCloning={isCloning}
          />
        )}

        {activeTab === 'diffs' && (
          <FileDiffViewer />
        )}

        {activeTab === 'tree' && (
          <FileTreeViewer onRefreshTrigger={refreshTrigger} />
        )}

        {activeTab === 'cli' && (
          <CliGuide />
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>Outreach Template Demo Adapter</span>
            <span>•</span>
            <span className="font-mono text-[11px]">bjud-in-oss/outreach-template-demo</span>
          </div>
          <div>
            Exkluderar <span className="font-mono text-stone-700">doc/skills/mattpocock</span> • Laddar <span className="font-mono text-indigo-600">google-gemini/gemini-skills</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
