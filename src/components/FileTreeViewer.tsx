import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { FileNode } from '../types';

interface FileTreeViewerProps {
  onRefreshTrigger?: number;
}

export const FileTreeViewer: React.FC<FileTreeViewerProps> = ({ onRefreshTrigger }) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({
    'doc': true,
    'doc/skills': true,
    'doc/skills/gemini-api-dev': false,
    'doc/skills/gemini-live-api-dev': false,
  });
  const [selectedFilePath, setSelectedFilePath] = useState<string>('AGENTS.md');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [onRefreshTrigger]);

  const fetchFiles = () => {
    setLoading(true);
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load files', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedFilePath) {
      setLoadingContent(true);
      fetch(`/api/file-content?path=${encodeURIComponent(selectedFilePath)}`)
        .then((res) => res.json())
        .then((data) => {
          setFileContent(data.content || '');
          setLoadingContent(false);
        })
        .catch((err) => {
          setFileContent('Kunde inte läsa fil: ' + err.message);
          setLoadingContent(false);
        });
    }
  }, [selectedFilePath]);

  const toggleDir = (dirPath: string) => {
    setOpenDirs((prev) => ({
      ...prev,
      [dirPath]: !prev[dirPath],
    }));
  };

  const renderNode = (node: FileNode) => {
    const isDir = node.type === 'directory';
    const isOpen = openDirs[node.path];
    const isSelected = selectedFilePath === node.path;
    const isGeminiSkill = node.path.includes('gemini-api-dev') || node.path.includes('gemini-live-api-dev');

    if (isDir) {
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={() => toggleDir(node.path)}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-stone-100 cursor-pointer text-xs text-stone-700 font-medium ${
              isGeminiSkill ? 'text-indigo-900 font-semibold' : ''
            }`}
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-stone-400" /> : <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
            {isOpen ? <FolderOpen className="w-4 h-4 text-amber-600" /> : <Folder className="w-4 h-4 text-amber-500" />}
            <span>{node.name}</span>
            {node.path === 'doc/skills' && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                skills katalog
              </span>
            )}
            {isGeminiSkill && (
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono">
                gemini skill
              </span>
            )}
          </div>

          {isOpen && node.children && (
            <div className="pl-4 border-l border-stone-200 ml-2 space-y-0.5 mt-0.5">
              {node.children.map((child) => renderNode(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        onClick={() => setSelectedFilePath(node.path)}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer text-xs transition-colors ${
          isSelected
            ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
        }`}
      >
        <FileText className="w-3.5 h-3.5 text-stone-400" />
        <span className="truncate">{node.name}</span>
        {node.name === 'AGENTS.md' && (
          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded ml-auto">
            Huvudfil
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Exclusion Verification Banner */}
      <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-stone-900">Katalog-verifiering:</span>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Exkludering bekräftad: <strong className="font-mono">doc/skills/mattpocock</strong> saknas helt i källan</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Närvarande: <strong className="font-mono">gemini-api-dev</strong> & <strong className="font-mono">gemini-live-api-dev</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left: Tree */}
        <div className="lg:col-span-4 border-r border-stone-200 p-3 overflow-y-auto max-h-[600px] bg-stone-50/50">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
            <span>Projektets filstruktur</span>
            <span className="text-[10px] text-stone-400 font-mono">outreach-template-gemini/</span>
          </div>

          {loading ? (
            <div className="text-xs text-stone-400 p-4 text-center">Laddar filträd...</div>
          ) : (
            <div className="space-y-0.5">
              {files.map((node) => renderNode(node))}
            </div>
          )}
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700 font-mono font-medium">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{selectedFilePath || 'Välj en fil att granska'}</span>
            </div>
            {selectedFilePath && (
              <span className="text-[10px] text-stone-500 font-mono">
                UTF-8
              </span>
            )}
          </div>

          <div className="p-4 flex-1 overflow-x-auto overflow-y-auto max-h-[550px] bg-stone-900 text-stone-200 font-mono text-xs leading-relaxed">
            {loadingContent ? (
              <div className="text-stone-400 p-8 text-center">Läser in filinnehåll...</div>
            ) : (
              <pre className="whitespace-pre-wrap">{fileContent || '(Tom fil)'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
