import React, { useState, useEffect } from 'react';
import { X, Save, Key, Server, AlertCircle, ExternalLink, CheckCircle, Trash2 } from 'lucide-react';
import { STORAGE_KEYS, getStoredConfig } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [flashEp, setFlashEp] = useState('');
  const [thinkingEp, setThinkingEp] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [usingEnv, setUsingEnv] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if we are currently using ENV vars (local storage empty but ENV present)
      const config = getStoredConfig();
      const hasLocal = localStorage.getItem(STORAGE_KEYS.API_KEY);
      const hasEnv = config && config.isEnv;

      if (hasEnv && !hasLocal) {
        setUsingEnv(true);
        // Don't pre-fill input fields if using ENV, keep them empty for override
      } else if (hasLocal && config) {
        setApiKey(config.apiKey);
        setFlashEp(config.flashEp);
        setThinkingEp(config.thinkingEp);
        setUsingEnv(false);
      }
      
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim() || !flashEp.trim() || !thinkingEp.trim()) {
        alert('Please fill in all fields to override system defaults.');
        return;
    }

    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey.trim());
    localStorage.setItem(STORAGE_KEYS.FLASH_EP, flashEp.trim());
    localStorage.setItem(STORAGE_KEYS.THINKING_EP, thinkingEp.trim());
    
    setIsSaved(true);
    setUsingEnv(false);
    setTimeout(() => {
        onClose();
        window.location.reload(); // Reload to apply new keys
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    localStorage.removeItem(STORAGE_KEYS.FLASH_EP);
    localStorage.removeItem(STORAGE_KEYS.THINKING_EP);
    
    setApiKey('');
    setFlashEp('');
    setThinkingEp('');
    
    // If env vars exist, we fall back to them
    const config = getStoredConfig();
    if (config && config.isEnv) {
        setUsingEnv(true);
        alert("Local configuration cleared. Reverted to System Default keys.");
    } else {
        setUsingEnv(false);
        alert("Configuration cleared.");
    }
    
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-lg font-serif text-amber-100/90 tracking-wide flex items-center gap-2">
                <Server className="w-4 h-4" />
                API Configuration
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
            
            {/* Environment Status Banner */}
            {usingEnv && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-200/90 leading-relaxed flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                    <div>
                        <p className="font-semibold mb-1 text-green-400">System Default Active</p>
                        <p className="opacity-80">
                            当前正在使用系统预设的 API 密钥。您可以直接开始使用，或者在下方填入您自己的密钥进行覆盖。
                            <br/>
                            Using system provided keys. You can start immediately or override with your own keys below.
                        </p>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200/80 leading-relaxed">
                <p className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                        为了保护您的隐私，自定义密钥仅存储在您的浏览器本地 (Local Storage)，直接请求火山引擎接口。
                        <br/>
                        Custom keys are stored locally in your browser and requests are sent directly to Volcengine.
                    </span>
                </p>
                <a href="https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-amber-400 hover:underline">
                    获取密钥 / Get Keys <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Volcengine API Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={usingEnv ? "(Using System Default)" : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder-slate-700"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Flash Endpoint ID (Fast)</label>
                    <input 
                        type="text" 
                        value={flashEp}
                        onChange={(e) => setFlashEp(e.target.value)}
                        placeholder={usingEnv ? "(Using System Default)" : "ep-202...-flash"}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-slate-200 focus:border-amber-500/50 outline-none transition-all placeholder-slate-700 font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Thinking Endpoint ID (Deep)</label>
                    <input 
                        type="text" 
                        value={thinkingEp}
                        onChange={(e) => setThinkingEp(e.target.value)}
                        placeholder={usingEnv ? "(Using System Default)" : "ep-202...-thinking"}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-slate-200 focus:border-amber-500/50 outline-none transition-all placeholder-slate-700 font-mono"
                    />
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
            {!usingEnv && (apiKey || flashEp) && (
                <button 
                    onClick={handleClear}
                    className="w-12 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Clear Configuration"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            
            <button 
                onClick={handleSave}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest transition-all duration-300 ${
                    isSaved 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-amber-500 text-black hover:bg-amber-400'
                }`}
            >
                {isSaved ? (
                    <>Saved successfully</>
                ) : (
                    <>
                        <Save className="w-4 h-4" /> 
                        {usingEnv ? 'Override Default' : 'Save Configuration'}
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};