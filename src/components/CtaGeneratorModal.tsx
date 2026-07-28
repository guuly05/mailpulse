import React, { useState, useEffect } from "react";
import {
  MousePointerClick,
  Sparkles,
  Check,
  Copy,
  X,
  TrendingUp,
  Target,
  Zap,
  Info,
  RefreshCw,
  ShieldCheck,
  Flame,
  Award,
  ArrowRight
} from "lucide-react";

export interface CtaVariation {
  text: string;
  angle: string;
  predictedCtr: string;
  effectivenessScore: number;
  rationale: string;
  secondaryNote: string;
}

interface CtaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
  brandName: string;
  tone: string;
  audience: string;
  prompt: string;
  promoCode: string;
  currentCtaText: string;
  onSelectCta: (selectedCta: string, secondaryNote?: string) => void;
}

export const CtaGeneratorModal: React.FC<CtaGeneratorModalProps> = ({
  isOpen,
  onClose,
  goal,
  brandName,
  tone,
  audience,
  prompt,
  promoCode,
  currentCtaText,
  onSelectCta,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ctas, setCtas] = useState<CtaVariation[]>([]);
  const [goalSummary, setGoalSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const fetchCtaVariations = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-ctas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          brandName,
          tone,
          audience,
          prompt,
          promoCode,
        }),
      });

      const data = await res.json();
      if (data.success && data.ctas) {
        setCtas(data.ctas);
        setGoalSummary(data.goalSummary || "");
      } else {
        setError(data.error || "Failed to generate CTA button variations.");
      }
    } catch (err: any) {
      setError(err.message || "Network error generating CTAs.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && ctas.length === 0 && !isGenerating) {
      fetchCtaVariations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getAngleBadgeColor = (angle: string) => {
    const lower = angle.toLowerCase();
    if (lower.includes("urgency") || lower.includes("scarcity")) {
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
    if (lower.includes("benefit") || lower.includes("value")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (lower.includes("friction") || lower.includes("risk")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
    if (lower.includes("ownership") || lower.includes("first")) {
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    }
    return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">AI CTA Button Generator</h3>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  5 CRO Variations
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data-backed call-to-action button variations optimized for your campaign goal ({goal || "Promotional Sale"})
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Campaign Goal Context Banner */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-slate-200">Active Goal: {goal || "General Marketing"}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{brandName}</span>
              </div>
              {goalSummary && <p className="text-slate-400 text-[11px]">{goalSummary}</p>}
            </div>

            <button
              onClick={fetchCtaVariations}
              disabled={isGenerating}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Re-generate CTAs</span>
            </button>
          </div>

          {/* Loading Skeleton State */}
          {isGenerating && (
            <div className="space-y-3 py-6 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-200">Analyzing goal & engineering 5 CRO CTA button variations...</p>
              <p className="text-xs text-slate-400">Testing psychological triggers: Urgency, Benefit, Low-Friction & Ownership</p>
            </div>
          )}

          {/* Error Message */}
          {error && !isGenerating && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* CTA Variations List */}
          {!isGenerating && ctas.length > 0 && (
            <div className="space-y-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select a CTA Variation to Apply to Campaign Wizard:
              </p>

              {ctas.map((cta, idx) => {
                const isSelected = currentCtaText === cta.text || selectedIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`group relative bg-slate-950 border rounded-2xl p-4 transition duration-200 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      
                      {/* Left: Angle & CTR Score */}
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{idx + 1}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getAngleBadgeColor(cta.angle)}`}>
                          {cta.angle}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{cta.predictedCtr}</span>
                        </span>
                      </div>

                      {/* Right: Score */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Effectiveness Score</span>
                        <span className="bg-slate-900 border border-slate-700 text-amber-300 font-bold font-mono text-xs px-2 py-0.5 rounded-lg">
                          {cta.effectivenessScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Button Visual Preview */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center my-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIdx(idx);
                          onSelectCta(cta.text, cta.secondaryNote);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-2.5 px-6 rounded-xl shadow-md transition transform active:scale-95 flex items-center space-x-2"
                      >
                        <span>{cta.text}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                      {cta.secondaryNote && (
                        <span className="text-[11px] text-slate-400 text-center font-medium">
                          {cta.secondaryNote}
                        </span>
                      )}
                    </div>

                    {/* CRO Rationale */}
                    <div className="mt-2 text-[11px] text-slate-400 flex items-start space-x-1.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-300">Why it works: </span>
                        {cta.rationale}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCopy(cta.text)}
                        className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition"
                      >
                        {copiedText === cta.text ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Copy Text</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIdx(idx);
                          onSelectCta(cta.text, cta.secondaryNote);
                        }}
                        className={`text-xs font-bold px-4 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                            : "bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                            <span>Selected CTA</span>
                          </>
                        ) : (
                          <>
                            <MousePointerClick className="w-3.5 h-3.5" />
                            <span>Select CTA Button</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
          <p className="text-[11px] text-slate-500">
            Selected CTA will automatically populate your Campaign Wizard.
          </p>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 py-2 rounded-xl transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
