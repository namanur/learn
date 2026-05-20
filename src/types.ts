export interface DocLink {
  title: string;
  url: string;
  category: string;
  summary: string;
}

export interface DetailSection {
  title: string;
  text: string;
}

export interface Node {
  id: string;
  label: string;
  type: 'storage' | 'process' | 'network' | 'user' | 'system';
  description: string;
}

export interface Edge {
  from: string;
  to: string;
  label: string;
  action: string;
}

export interface VisualArchitecture {
  nodes: Node[];
  edges: Edge[];
  description: string;
  interactionPrompt: string;
}

export interface AudioSegment {
  id: number;
  text: string;
  timestamp: string; // MM:SS format representation
}

export interface CurriculumPhase {
  id: number;
  title: string;
  goals: string[];
  tooling: string;
  project: string;
  exitCriteria: string[];
  details: DetailSection[];
  docLinks: DocLink[];
  architecture: VisualArchitecture;
  audioSpeech: AudioSegment[];
}

export interface OverviewData {
  title: string;
  description: string;
  environment: {
    title: string;
    items: string[];
  }[];
  methodology: string;
}
