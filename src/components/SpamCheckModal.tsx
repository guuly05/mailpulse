import React from "react";
import { SpamScoreAnalysis } from "../types";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, X } from "lucide-react";

interface SpamCheckModalProps {
  analysis: SpamScoreAnalysis;
  onClose: () => void;
}

export const SpamCheckModal: React.FC<SpamCheckModalProps> = ({
  analysis,
  onClose,
}) => {
  const isGood = analysis.score >= 80;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
            isGood ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}>
            {isGood ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deliverability & Spam Audit</h3>
            <p className="text-xs text-slate-400">AI analysis for Gmail, Outlook & Apple Mail filters</p>
          </div>
        </div>

        {/* Score & Grade Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Deliverability Score</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className={`text-3xl font-extrabold font-mono ${isGood ? "text-emerald-400" : "text-amber-400"}`}>
                {analysis.score}/100
              </span>
              <span className="text-xs font-semibold text-slate-400">Grade: {analysis.grade || (isGood ? "A" : "B")}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
              isGood ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              {isGood ? "Primary Inbox Ready" : "Minor Spam Risk"}
            </span>
          </div>
        </div>

        {/* Trigger Words Section */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Identified Spam Trigger Words</span>
          </h4>
          {analysis.triggerWordsFound && analysis.triggerWordsFound.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {analysis.triggerWordsFound.map((word, idx) => (
                <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded-md font-mono">
                  "{word}"
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>No high-risk spam trigger words detected in copy!</span>
            </p>
          )}
        </div>

        {/* Actionable Recommendations */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Deliverability Recommendations
          </h4>
          <ul className="space-y-2">
            {analysis.recommendations?.map((rec, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
