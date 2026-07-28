import React, { useState } from "react";
import { EmailCampaign } from "../types";
import { performContentAudit, ContentAuditReport, ValuePropCheck, ComponentCharCount } from "../utils/contentAudit";
import {
  FileSearch,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Clock,
  Zap,
  Target,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  BarChart2,
  AlignLeft,
  ArrowRight,
  RefreshCw,
  Info
} from "lucide-react";

interface ContentAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  onApplyFix?: (fixType: string, newValue: string) => void;
}

export const ContentAuditModal: React.FC<ContentAuditModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onApplyFix,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "readability" | "valueProps" | "improvements">("overview");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !campaign) return null;

  const report: ContentAuditReport = performContentAudit(campaign);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 70) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    if (score >= 55) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  const getStatusBadge = (status: ComponentCharCount["status"]) => {
    switch (status) {
      case "optimal":
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Optimal</span>
          </span>
        );
      case "short":
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Brief</span>
          </span>
        );
      case "long":
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Long</span>
          </span>
        );
      case "missing":
        return (
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Missing</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Campaign Content Audit</h3>
                <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${getScoreColor(report.overallScore)}`}>
                  Grade {report.gradeLetter} ({report.overallScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-depth copy scan for reading grade, character count limits & key value propositions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 pt-3 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
              activeTab === "overview"
                ? "bg-slate-900 text-white border-slate-800 text-amber-400 border-t-amber-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Overview & Score</span>
          </button>

          <button
            onClick={() => setActiveTab("readability")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
              activeTab === "readability"
                ? "bg-slate-900 text-white border-slate-800 text-amber-400 border-t-amber-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Readability & Length</span>
            <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full">
              Grade {report.readability.gradeLevel}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("valueProps")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
              activeTab === "valueProps"
                ? "bg-slate-900 text-white border-slate-800 text-amber-400 border-t-amber-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Value Propositions</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] px-1.5 py-0.2 rounded-full">
              {report.detectedValuePropCount}/{report.totalValuePropCategories}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("improvements")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
              activeTab === "improvements"
                ? "bg-slate-900 text-white border-slate-800 text-amber-400 border-t-amber-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Actionable Fixes</span>
            {report.improvements.length > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {report.improvements.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Score Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Overall Score */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Content Score
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {report.overallScore}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${
                        report.overallScore >= 80 ? "bg-emerald-500" : report.overallScore >= 65 ? "bg-blue-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${report.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Reading Grade */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Reading Grade
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-white">
                      Grade {report.readability.gradeLevel}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-medium truncate">
                    {report.readability.label}
                  </span>
                </div>

                {/* Total Character Count */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Character Count
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-extrabold text-white font-mono">
                      {report.totalCharsWithSpaces.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">chars</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {report.totalCharsNoSpaces.toLocaleString()} without spaces
                  </span>
                </div>

                {/* Value Prop Coverage */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Value Props Included
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                      {report.detectedValuePropCount}
                    </span>
                    <span className="text-sm text-slate-500 font-mono">/ {report.totalValuePropCategories}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {Math.round((report.detectedValuePropCount / report.totalValuePropCategories) * 100)}% category coverage
                  </span>
                </div>

              </div>

              {/* Quick Reading Time & Skim Summary */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">
                      Estimated Reading Time: ~{report.estimatedReadTimeSeconds} seconds ({report.readability.wordCount} words)
                    </span>
                    <span className="text-slate-400">
                      Most subscribers spend under 10 seconds skimming emails before deciding to click.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("improvements")}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Fixes ({report.improvements.length})</span>
                </button>
              </div>

              {/* Audit Strengths & Key Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">Campaign Copy Strengths</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">Conversion Recommendations</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.improvements.slice(0, 4).map((imp, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: READABILITY & CHARACTER COUNTS */}
          {activeTab === "readability" && (
            <div className="space-y-6">
              
              {/* Detailed Readability Analysis Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-sm text-white">Flesch-Kincaid Readability Breakdown</h4>
                  </div>
                  <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold px-3 py-1 rounded-full">
                    {report.readability.label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {report.readability.recommendation}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Reading Ease Score</span>
                    <span className="text-lg font-bold font-mono text-white">{report.readability.readingEase} / 100</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Word Count</span>
                    <span className="text-lg font-bold font-mono text-white">{report.readability.wordCount} words</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Words / Sentence</span>
                    <span className="text-lg font-bold font-mono text-white">{report.readability.averageWordsPerSentence}</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Syllables</span>
                    <span className="text-lg font-bold font-mono text-white">{report.readability.syllableCount}</span>
                  </div>
                </div>
              </div>

              {/* Component Character Counts Breakdown */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                    <AlignLeft className="w-4 h-4 text-blue-400" />
                    <span>Component Character & Length Audit</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Target optimal ranges for mobile preview
                  </span>
                </div>

                <div className="space-y-3">
                  {report.componentCounts.map((comp, idx) => {
                    const pct = Math.min(100, Math.round((comp.charCount / comp.optimalRange[1]) * 100));
                    return (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">{comp.name}</span>
                            {getStatusBadge(comp.status)}
                          </div>

                          <div className="flex items-center space-x-2 text-xs font-mono">
                            <span className="text-white font-bold">{comp.charCount} chars</span>
                            <span className="text-slate-500">({comp.wordCount} words)</span>
                            <span className="text-slate-400 text-[11px]">Target: {comp.optimalRange[0]}-{comp.optimalRange[1]}</span>
                          </div>
                        </div>

                        {/* Visual Length Gauge */}
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full ${
                              comp.status === "optimal"
                                ? "bg-emerald-500"
                                : comp.status === "short"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                          <Info className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{comp.feedback}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: VALUE PROPOSITIONS AUDIT */}
          {activeTab === "valueProps" && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Value Proposition & Trigger Coverage</h4>
                  <p className="text-xs text-slate-400">
                    High-converting emails include key psychology triggers to maximize reader action.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {report.detectedValuePropCount}/{report.totalValuePropCategories}
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Triggers Present</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.valueProps.map((vp) => (
                  <div
                    key={vp.id}
                    className={`bg-slate-950 border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition ${
                      vp.detected ? "border-slate-800" : "border-amber-500/30 bg-amber-500/5"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          {vp.category}
                        </span>
                        {vp.detected ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Detected</span>
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Missing</span>
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-xs text-white">{vp.title}</h5>
                      <p className="text-[11px] text-slate-400">{vp.description}</p>
                    </div>

                    {vp.detected ? (
                      <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 text-[11px]">
                        <span className="text-slate-400 font-semibold block mb-0.5">Matched keywords:</span>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {vp.matchedTerms.map((t, idx) => (
                            <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono px-1.5 py-0.2 rounded">
                              "{t}"
                            </span>
                          ))}
                        </div>
                        {vp.excerptFound && (
                          <p className="text-slate-300 italic text-[10px] font-mono border-t border-slate-800/60 pt-1 mt-1">
                            {vp.excerptFound}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Recommendation: </span>
                          {vp.recommendation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIONABLE FIXES */}
          {activeTab === "improvements" && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Actionable Copy Optimization Checklist</h4>
                  <p className="text-xs text-slate-400">
                    Fix these items to lift reading engagement and increase click-through rates.
                  </p>
                </div>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                  {report.improvements.length} items to optimize
                </span>
              </div>

              {report.improvements.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">Flawless Copy Audit!</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Your campaign copy hits all optimal character bounds, readability standards, and key conversion value propositions.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.improvements.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block">{item}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(item)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shrink-0 self-end sm:self-center"
                      >
                        {copiedText === item ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Tip</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Tip</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
          <p className="text-[11px] text-slate-500">
            Content Audit updates in real-time as you edit your campaign.
          </p>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 py-2 rounded-xl transition"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
