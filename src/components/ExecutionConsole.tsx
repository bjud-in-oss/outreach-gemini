import React, { useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, FileEdit, Check } from 'lucide-react';

interface ExecutionConsoleProps {
  logs: string[];
  isCloning: boolean;
  onClearLogs?: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs, isCloning }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="space-y-4">
      {/* 3-Step Pipeline Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <span>Automatiserad Arbetskedja</span>
          <span className="text-xs font-normal text-stone-500">(Körs automatiskt)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 relative">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Selektiv Git Kloning
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Klonar med <code className="bg-stone-200/70 text-stone-800 px-1 rounded">sparse-checkout</code> och blob-filter för att helt exkludera <code className="text-red-700 font-mono">doc/skills/mattpocock</code> från hämtningen.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/50 relative">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                Installera Gemini Skills
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kör <code className="bg-indigo-100 text-indigo-900 px-1 rounded">npx skills add</code> för <span className="font-semibold text-indigo-800">gemini-api-dev</span> & <span className="font-semibold text-indigo-800">gemini-live-api-dev</span> både globalt och hermetiskt.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 relative">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Uppdatera Huvudfil
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uppdaterar <code className="bg-emerald-100 text-emerald-900 px-1 rounded">AGENTS.md</code> och <code className="bg-emerald-100 text-emerald-900 px-1 rounded">package.json</code> med SDK-beroenden och nya direktiv.
            </p>
          </div>
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-stone-950 rounded-xl overflow-hidden border border-stone-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs text-stone-400">
          <div className="flex items-center gap-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-stone-400" />
            <span>Exekveringslogg & Output</span>
          </div>
          <div className="flex items-center gap-2">
            {isCloning && (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Arbetar...
              </span>
            )}
            <span className="text-stone-500 font-mono">{logs.length} rader</span>
          </div>
        </div>

        <div className="p-4 font-mono text-xs text-stone-300 max-h-96 overflow-y-auto space-y-1.5 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-stone-600 py-6 text-center italic">
              Inga körningsloggar ännu. Klicka på "Kör Kloning & Synk" för att starta.
            </div>
          ) : (
            logs.map((log, index) => {
              const isSuccess = log.includes('✅') || log.includes('🎉');
              const isStep = log.includes('--- STEG');
              const isWarn = log.includes('⚠️');
              const isError = log.includes('❌');
              const isInfo = log.includes('ℹ️') || log.includes('🚀') || log.includes('📦');

              let lineClass = 'text-stone-300';
              if (isSuccess) lineClass = 'text-emerald-400 font-medium';
              if (isStep) lineClass = 'text-indigo-400 font-bold mt-2 pt-2 border-t border-stone-800/80';
              if (isWarn) lineClass = 'text-amber-400';
              if (isError) lineClass = 'text-red-400 font-bold';
              if (isInfo) lineClass = 'text-sky-300';

              return (
                <div key={index} className={`leading-relaxed whitespace-pre-wrap ${lineClass}`}>
                  {log}
                </div>
              );
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
