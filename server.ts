import express from 'express';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');
import { createServer as createViteServer } from 'vite';
import { runCloneAndConfigure } from './scripts/clone-outreach.mjs';

const app = express();
const PORT = 3000;

app.use(express.json());

const TARGET_DIR = path.resolve(process.cwd(), 'outreach-template-gemini');

// In-memory logs
let lastLogs: string[] = [];
let isCloning = false;
let lastResult: any = null;

// Helper to get file tree
function getFileTree(dir: string, baseDir: string = dir): any[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result: any[] = [];

  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        path: relativePath,
        type: 'directory',
        children: getFileTree(fullPath, baseDir),
      });
    } else {
      const stats = fs.statSync(fullPath);
      result.push({
        name: entry.name,
        path: relativePath,
        type: 'file',
        size: stats.size,
      });
    }
  }

  return result.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

// 1. API: Get status
app.get('/api/status', (req, res) => {
  const exists = fs.existsSync(TARGET_DIR);
  const hasMattPocock = exists && fs.existsSync(path.join(TARGET_DIR, 'doc', 'skills', 'mattpocock'));
  const hasGeminiApiDev = exists && fs.existsSync(path.join(TARGET_DIR, 'doc', 'skills', 'gemini-api-dev', 'SKILL.md'));
  const hasGeminiLiveApiDev = exists && fs.existsSync(path.join(TARGET_DIR, 'doc', 'skills', 'gemini-live-api-dev', 'SKILL.md'));

  res.json({
    cloned: exists,
    isCloning,
    targetDir: TARGET_DIR,
    repoUrl: 'https://github.com/bjud-in-oss/outreach-template-demo',
    excludedPath: 'doc/skills/mattpocock',
    hasMattPocock,
    hasGeminiApiDev,
    hasGeminiLiveApiDev,
    logs: lastLogs,
    lastResult,
  });
});

// 2. API: Run clone & configure
app.post('/api/run-clone', async (req, res) => {
  if (isCloning) {
    return res.status(409).json({ error: 'En kloning körs redan.' });
  }

  isCloning = true;
  lastLogs = [];

  try {
    const result = await runCloneAndConfigure({
      targetDir: TARGET_DIR,
      onLog: (msg: string) => {
        lastLogs.push(msg);
      },
    });

    lastResult = result;
    isCloning = false;
    res.json(result);
  } catch (err: any) {
    isCloning = false;
    res.status(500).json({ error: err.message || 'Kloning misslyckades' });
  }
});

// 3. API: Get files tree
app.get('/api/files', (req, res) => {
  if (!fs.existsSync(TARGET_DIR)) {
    return res.json({ files: [] });
  }
  const tree = getFileTree(TARGET_DIR);
  res.json({ files: tree });
});

// 4. API: Read file content
app.get('/api/file-content', (req, res) => {
  const relativePath = req.query.path as string;
  if (!relativePath) {
    return res.status(400).json({ error: 'Sökväg krävs' });
  }

  // Prevent path traversal
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(TARGET_DIR, safePath);

  if (!fullPath.startsWith(TARGET_DIR)) {
    return res.status(403).json({ error: 'Otillåten sökväg' });
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Filen hittades inte' });
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ path: safePath, content });
  } catch (err: any) {
    res.status(500).json({ error: 'Kunde inte läsa fil: ' + err.message });
  }
});

// 5. API: Download repository as ZIP
app.get('/api/download-zip', (req, res) => {
  if (!fs.existsSync(TARGET_DIR)) {
    return res.status(404).json({ error: 'Projektet har inte klonats ännu. Kör kloningen först.' });
  }

  try {
    const zip = new AdmZip();

    function addFolderToZip(dir: string, zipPath: string = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === '.git') continue;
        const fullPath = path.join(dir, entry.name);
        const entryZipPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          addFolderToZip(fullPath, entryZipPath);
        } else {
          zip.addLocalFile(fullPath, zipPath);
        }
      }
    }

    addFolderToZip(TARGET_DIR);
    const zipBuffer = zip.toBuffer();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="outreach-template-gemini.zip"');
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  } catch (err: any) {
    res.status(500).json({ error: 'Kunde inte skapa zip-arkiv: ' + err.message });
  }
});

// 6. API: Get Diffs of Main Files
app.get('/api/diffs', (req, res) => {
  const originalFiles: Record<string, string> = {
    'AGENTS.md': `# RUTINER FÖR SKILL- OCH TICKET-ADAPTERING (AGENTS.md v9.8)

1. Central ticket-logistik (doc/TICKETS.md)
* Registrera enbart aktiva ärenden (\`Open\`, \`In Progress\`) i \`doc/TICKETS.md\`. Rensa rader med status \`Closed\` vid cykelavslut i Steg 4.
* Knyt varje ticket till 1 domän under \`src/features/\` (eller \`Global\`).

2. Tregradig Agentdynamik (Följa, Vända om, Förlikas)
* Att följa (Steg 1a–1b): Formulera i Steg 1a tre fokuserade GROW-frågor ställda mot ändringens faktiska risknoder (\`State\`, \`Contract\`, \`Effects\`, \`Resilience\`). Besvara frågorna i \`1b_kartlagga.md\`, sätt \`"active_vectors"\` och driv kedjan $1b \\rightarrow 2a \\rightarrow 2b \\rightarrow 2e \\rightarrow 3c$ linjärt vid $V < 2$.
* Att vända om (Terminal & API): Exekvera \`npm run verify\` i terminalen för att köra parallella granskningar via Gemini API. Låt bakgrundsskriptet validera kontrakt, resiliens och gränssnitt oberoende av chattens kontext.
* Att förlikas (Steg 2e–3c & Token Gate): Avsluta Steg 2 i \`2e_forsoning_och_forlikning.md\` med nyckelordet \`MÄTTNAD: JA\` när alla målkonflikter lösts. Stanna vid Steg 3c och presentera koden från \`REQUIRED_TOKEN.txt\` i chatten.

3. TDD Exekvering i Fas 2 (Steg 4)
* Skapa \`doc/LAST_CYCLE/APPROVAL.md\` när användaren bekräftat koden i chatten.
* Skapa enhetstester med aktiva interaktionspåståenden i \`src/\` före källkodsändringar i Steg 4.`,
    'package.json': `{
  "name": "system-architecture-template",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "verify": "node scripts/verify-architecture.js",
    "test": "vitest run --environment jsdom",
    "init-hashes": "node scripts/init-hashes.js"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "motion": "^12.4.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.2"
  }
}`,
    'SKILLS_STRATEGI.md': `# Färdighetsstrategi: Varför vi skickar med Matt Pococks Skills direkt i repot

## Frågeställning: Klona vid körtid vs. Skicka med direkt i repot?
### Slutsats: Det är BETYDLIGT SÄKRARE att skicka med dem i repot (\`doc/skills/mattpocock/\`).
...
Systeminstruktionen (SI v9.3) och kvalitetsvakten (\`verify-architecture.js\`) förväntar sig exakta filvägar som t.ex. \`doc/skills/mattpocock/skills/engineering/wayfinder/SKILL.md\`.`,
  };

  const currentFiles: Record<string, string> = {};
  for (const [key] of Object.entries(originalFiles)) {
    const p = path.join(TARGET_DIR, key);
    if (fs.existsSync(p)) {
      currentFiles[key] = fs.readFileSync(p, 'utf-8');
    } else {
      currentFiles[key] = '(Filen finns inte ännu - kör kloning)';
    }
  }

  res.json({
    original: originalFiles,
    current: currentFiles,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
