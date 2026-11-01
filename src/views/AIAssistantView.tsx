import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Send, CheckCircle2, AlertCircle, Bot, Copy, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const AIAssistantView: React.FC = () => {
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);
  const [requirements, setRequirements] = useState(
    'Create an e-commerce checkout flow with Stripe payment integration, order tracking dashboard, and email receipt notifications.'
  );
  const [generatedScope, setGeneratedScope] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    api.get('/health').then((res: any) => {
      setOllamaStatus(res.data.aiStatus);
    });
  }, []);

  const handleGenerateScope = async () => {
    setIsGenerating(true);
    try {
      const res: any = await api.post('/ai/generate-scope', { requirements });
      setGeneratedScope(res.data);
    } catch (e: any) {
      alert('Generation error: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Client & Workflow Assistant</h1>
          <p className="text-sm text-slate-500 mt-1">
            Privacy-first local AI engine running on Ollama. Generate proposals, analyze client scope, and draft updates at zero cost.
          </p>
        </div>

        {/* Runtime Connection Pill */}
        <div className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2 ${
          ollamaStatus?.isAvailable
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${ollamaStatus?.isAvailable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span>{ollamaStatus?.isAvailable ? 'Ollama Online' : 'Smart Heuristic Fallback Mode'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input & Prompt Controls */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI Proposal & Scope Generator</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Describe Project Deliverables or Client Brief:
            </label>
            <textarea
              rows={6}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed font-sans"
              placeholder="Enter client project requirements, features, or architectural brief..."
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-400">
              Zero cloud cost &bull; 100% confidential data
            </span>
            <button
              onClick={handleGenerateScope}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Synthesizing Line Items...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" /> Generate Structured Scope
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output & Structured Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Synthesized Line Items & Schedule
              </span>
              {generatedScope?.aiProvider && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {generatedScope.aiProvider}
                </span>
              )}
            </div>

            {generatedScope ? (
              <div className="space-y-3">
                <div className="font-bold text-sm text-slate-900">{generatedScope.scopeTitle}</div>

                <div className="space-y-2">
                  {generatedScope.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-medium">{item.description}</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0 ml-4">${item.unitPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900 space-y-1">
                  <div className="font-semibold">Recommended Commercial Terms:</div>
                  <p className="text-[11px] text-indigo-800">{generatedScope.terms}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Bot className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Click "Generate Structured Scope" to parse requirements into line-item estimates.</p>
              </div>
            )}
          </div>

          {generatedScope && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <a
                href={`/quotations?title=${encodeURIComponent(generatedScope.scopeTitle)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Populate into Quotation Builder <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
