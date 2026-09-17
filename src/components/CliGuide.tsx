import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Code2, ShieldAlert } from 'lucide-react';

export const CliGuide: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const commands = [
    {
      id: 'cmd-script',
      title: '1. Kör den kompletta automatiseringsrutinen med ett enda kommando',
      description: 'Klonar repot, filtrerar bort mattpocock, installerar gemini-skills och uppdaterar huvudfilerna automatiskt.',
      code: `npm run clone-outreach`,
    },
    {
      id: 'cmd-clone-sparse',
      title: '2. Manuell Git sparse-checkout med katalog-exkludering',
      description: 'Så här exkluderas doc/skills/mattpocock direkt vid nedladdningen via git sparse-checkout:',
      code: `# 1. Klona med blob-filter och sparse-flagga (laddar inte ner mattpocock)
git clone --depth 1 --filter=blob:none --sparse https://github.com/bjud-in-oss/outreach-template-demo outreach-gemini
cd outreach-gemini

# 2. Sätt sparse checkout regeln: inkludera allt utom doc/skills/mattpocock
git sparse-checkout set --no-cone '/*' '!/doc/skills/mattpocock'
git checkout main`,
    },
    {
      id: 'cmd-skills-install',
      title: '3. Installera och ladda Google Gemini Skills',
      description: 'Installerar de två officiella Google Gemini-färdigheterna globalt med skills-CLI:et:',
      code: `# Installera gemini-api-dev (SDK @google/genai, text, multimodal, structured JSON)
npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global

# Installera gemini-live-api-dev (Live API 3.8 realtids dubbelriktad streaming)
npx skills add google-gemini/gemini-skills --skill gemini-live-api-dev --global`,
    },
    {
      id: 'cmd-verify',
      title: '4. Verifiera arkitektur och köra test',
      description: 'Testa den anpassade applikationsmallen:',
      code: `# Installera beroenden inklusive @google/genai
npm install

# Kör arkitekturverifiering
npm run verify`,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          <span>Kommandon & Terminalguide för Utvecklare</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Här är de exakta kommandona för att köra processen manuellt eller integrera den i dina egna arbetsflöden.
        </p>
      </div>

      <div className="space-y-4">
        {commands.map((cmd) => (
          <div key={cmd.id} className="rounded-lg border border-stone-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-900">{cmd.title}</h3>
                <p className="text-[11px] text-stone-500">{cmd.description}</p>
              </div>
              <button
                onClick={() => copyToClipboard(cmd.code, cmd.id)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 transition-colors"
              >
                {copiedId === cmd.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Kopierad</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Kopiera</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-stone-900 font-mono text-xs text-stone-200 overflow-x-auto leading-relaxed">
              <pre>{cmd.code}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
