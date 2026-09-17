import React from 'react';
import { Download, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { StatusResponse } from '../types';

interface HeaderProps {
  status: StatusResponse | null;
  isCloning: boolean;
  onRunClone: () => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  isCloning,
  onRunClone,
  onDownloadZip,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  Outreach Template Gemini Cloner
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    SI v9.8 + Gemini
                  </span>
                </h1>
                <p className="text-sm text-stone-500">
                  Selektiv kloning exklusive <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded text-xs">mattpocock</code> med Google Gemini Skills
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <a
                href="https://github.com/bjud-in-oss/outreach-template-demo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <span>Källa:</span>
                <span className="font-mono font-medium">bjud-in-oss/outreach-template-demo</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Exkluderad:</span>
                <span className="font-mono font-semibold">doc/skills/mattpocock</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Skills:</span>
                <span className="font-mono font-semibold">gemini-api-dev</span>
                <span>&</span>
                <span className="font-mono font-semibold">gemini-live-api-dev</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              id="run-clone-btn"
              onClick={onRunClone}
              disabled={isCloning}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-xs ${
                isCloning
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isCloning ? 'animate-spin' : ''}`} />
              <span>{isCloning ? 'Klonar & Synkar...' : 'Kör Kloning & Synk'}</span>
            </button>

            <button
              id="download-zip-btn"
              onClick={onDownloadZip}
              disabled={!status?.cloned || isCloning}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-xs ${
                !status?.cloned || isCloning
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Ladda ner som ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
