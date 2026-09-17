import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { DiffData } from '../types';

interface FileDiffViewerProps {
  onRefresh?: () => void;
}

export const FileDiffViewer: React.FC<FileDiffViewerProps> = () => {
  const [diffData, setDiffData] = useState<DiffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>('AGENTS.md');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/diffs')
      .then((res) => res.json())
      .then((data) => {
        setDiffData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load diffs', err);
        setLoading(false);
      });
  }, []);

  const fileKeys = diffData ? Object.keys(diffData.original) : [];

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500">
        Laddar filändringar och jämförelse...
      </div>
    );
  }

  const originalContent = diffData?.original[selectedFile] || '';
  const currentContent = diffData?.current[selectedFile] || '';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* File Navigation Tabs */}
      <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {fileKeys.map((filename) => (
            <button
              key={filename}
              onClick={() => setSelectedFile(filename)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedFile === filename
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{filename}</span>
              {filename === 'AGENTS.md' && (
                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                  Huvudfil
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleCopy(currentContent)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors shadow-2xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Kopierad!' : 'Kopiera ny fil'}</span>
        </button>
      </div>

      {/* Side by side comparison */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Fil: {selectedFile}</span>
            {selectedFile === 'AGENTS.md' && (
              <span className="text-stone-500">
                (Projektets systemfil för agentrutiner och färdighetsdeklaration)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Före (Original med Matt Pocock)
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Efter (Med Google Gemini Skills)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Original */}
          <div className="rounded-lg border border-red-200/80 bg-red-50/20 overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 bg-red-100/50 border-b border-red-200 text-xs font-semibold text-red-900 flex items-center justify-between">
              <span>Original (bjud-in-oss/outreach-template-demo)</span>
              <span className="text-[10px] text-red-700">Tidigare skickat med mattpocock</span>
            </div>
            <pre className="p-3 text-xs font-mono text-stone-700 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] flex-1">
              {originalContent}
            </pre>
          </div>

          {/* Right: Updated */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/20 overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 bg-emerald-100/50 border-b border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between">
              <span>Uppdaterad version (Google Gemini Skills Edition)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Aktiv konfiguration</span>
            </div>
            <pre className="p-3 text-xs font-mono text-stone-800 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] flex-1">
              {currentContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
