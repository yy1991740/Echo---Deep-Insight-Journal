
export interface InsightResult {
  mood: string;
  deep_insight: string;
  golden_quote: string;
}

export enum AppState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type Language = 'zh' | 'en';

// Extend the global interfaces for Web Speech API and Vite Environment support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface ImportMetaEnv {
    readonly VITE_VOLC_API_KEY?: string;
    readonly VITE_FLASH_EP?: string;
    readonly VITE_THINKING_EP?: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
