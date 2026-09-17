import React from 'react';
import { StatusResponse } from '../types';
import { Check, X, ShieldAlert, Sparkles, FolderGit2, Cpu, FileCheck } from 'lucide-react';

interface StatsOverviewProps {
  status: StatusResponse | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ status }) => {
  const isCloned = !!status?.cloned;
  const hasMattPocock = status?.hasMattPocock ?? false;
  const hasGeminiApiDev = status?.hasGeminiApiDev ?? false;
  const hasGeminiLiveApiDev = status?.hasGeminiLiveApiDev ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Repository Status */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Repository</span>
          <FolderGit2 className="w-4 h-4 text-stone-400" />
        </div>
        <div className="text-xl font-bold text-stone-900">
          {isCloned ? 'Klonat & Redo' : 'Väntar på körning'}
        </div>
        <div className="text-xs text-stone-500 mt-1 truncate" title="bjud-in-oss/outreach-template-demo">
          bjud-in-oss/outreach-template-demo
        </div>
      </div>

      {/* Card 2: Exclusion Status */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Katalog-exkludering</span>
          <ShieldAlert className={`w-4 h-4 ${hasMattPocock ? 'text-red-500' : 'text-emerald-500'}`} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-md ${
            !hasMattPocock
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {!hasMattPocock ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {!hasMattPocock ? 'Exkluderad (0 byte)' : 'Hittades! (Fel)'}
          </span>
        </div>
        <div className="text-xs text-stone-500 mt-2 truncate font-mono">
          doc/skills/mattpocock
        </div>
      </div>

      {/* Card 3: Google Gemini Skills */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Google Gemini Skills</span>
          <Sparkles className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl font-bold text-stone-900">
          {hasGeminiApiDev && hasGeminiLiveApiDev ? '2 Aktiva Skills' : 'Ej konfigurerade'}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-indigo-600">
          <span>gemini-api-dev</span>
          <span>•</span>
          <span>gemini-live-api-dev</span>
        </div>
      </div>

      {/* Card 4: Project Config Files */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Huvudfilskonfig</span>
          <FileCheck className="w-4 h-4 text-stone-400" />
        </div>
        <div className="text-xl font-bold text-stone-900">
          {isCloned ? 'Uppdaterad & Synkad' : 'Ej initierad'}
        </div>
        <div className="text-xs text-stone-500 mt-1">
          AGENTS.md & package.json anpassade
        </div>
      </div>
    </div>
  );
};
