import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Star, Sparkles, Smile, Frown, Meh } from 'lucide-react';
import api from '../services/api';

export const FeedbackView: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/feedback').then((res: any) => setFeedbackList(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Reviews & Sentiment</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time client satisfaction telemetry analyzed by Ollama NLP sentiment models.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackList.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900">{fb.clientName}</span>
                <span className="block text-[10px] text-slate-400 font-mono">{fb.createdAt}</span>
              </div>
              <div className="flex text-amber-400 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{fb.comment}"
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> AI Sentiment
              </span>
              <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] flex items-center gap-1 ${
                fb.sentimentLabel === 'positive'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : fb.sentimentLabel === 'negative'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {fb.sentimentLabel === 'positive' && <Smile className="w-3 h-3" />}
                {fb.sentimentLabel === 'negative' && <Frown className="w-3 h-3" />}
                {fb.sentimentLabel === 'neutral' && <Meh className="w-3 h-3" />}
                {fb.sentimentLabel} ({Math.round((fb.sentimentScore || 0.8) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
