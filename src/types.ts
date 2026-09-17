export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
}

export interface StatusResponse {
  cloned: boolean;
  isCloning: boolean;
  targetDir: string;
  repoUrl: string;
  excludedPath: string;
  hasMattPocock: boolean;
  hasGeminiApiDev: boolean;
  hasGeminiLiveApiDev: boolean;
  logs: string[];
  lastResult: {
    success: boolean;
    targetDir: string;
    repoUrl: string;
    excludedPath: string;
    installedSkills: string[];
    updatedFiles: string[];
    logs: string[];
    stats?: {
      totalFiles: number;
      hasMattPocock: boolean;
      hasGeminiApiDev: boolean;
      hasGeminiLiveApiDev: boolean;
    };
  } | null;
}

export interface DiffData {
  original: Record<string, string>;
  current: Record<string, string>;
}
