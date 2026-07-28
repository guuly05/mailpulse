import React, { useState } from "react";
import { calculateReadability } from "../utils/readability";
import { BookOpen, Info, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle, FileSearch } from "lucide-react";

interface ReadabilityScoreBarProps {
  bodyParagraphs: string[];
  headline?: string;
  subheadline?: string;
  onOpenContentAudit?: () => void;
}

export const ReadabilityScoreBar: React.FC<ReadabilityScoreBarProps> = ({
  bodyParagraphs,
  headline,
  subheadline,
  onOpenContentAudit,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Combine full copy text for analysis
  const fullText = [headline, subheadline, ...(bodyParagraphs || [])]
    .filter(Boolean)
    .join(". ");

  const metrics = calculateReadability(fullText);

  // Progress bar color based on score
  const getProgressColor = () => {
    if (metrics.readingEase >= 80) return "bg-emerald-500";
    if (metrics.readingEase >= 65) return "bg-blue-500";
    if (metrics.readingEase >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getBadgeColor = () => {
    if (metrics.readingEase >= 80)
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (metrics.readingEase >= 65)
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (metrics.readingEase >= 50)
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div id="readability-score-card" className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-slate-100 my-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">
                Flesch-Kincaid Readability Score
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor()}`}
              >
                {metrics.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {metrics.recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenContentAudit && (
            <button
              onClick={onOpenContentAudit}
              className="text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition flex items-center space-x-1"
              title="Open Complete Content Audit Tool"
            >
              <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Full Content Audit</span>
            </button>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center space-x-1 shrink-0 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg transition"
          >
            <span className="font-mono text-white font-bold">{metrics.readingEase}/100</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 relative my-2">
        <div
          className={`h-full transition-all duration-500 rounded-full ${getProgressColor()}`}
          style={{ width: `${metrics.readingEase}%` }}
        />
      </div>

      {/* Expanded Metrics Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs animate-fadeIn">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Reading Grade
            </span>
            <span className="text-sm font-bold font-mono text-white">
              Grade {metrics.gradeLevel}
            </span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Total Words
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {metrics.wordCount}
            </span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Avg Words / Sentence
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {metrics.averageWordsPerSentence}
            </span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">
              Total Syllables
            </span>
            <span className="text-sm font-bold font-mono text-white">
              {metrics.syllableCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
