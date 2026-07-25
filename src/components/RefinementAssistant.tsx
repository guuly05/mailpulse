import React, { useState } from "react";
import { EmailCampaign, SendTimeRecommendation } from "../types";
import {
  Sparkles,
  Send,
  Clock,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Zap,
  Info,
  CalendarDays,
  X,
} from "lucide-react";

interface RefinementAssistantProps {
  onRefine: (instruction: string) => void;
  isRefining: boolean;
  campaign?: EmailCampaign;
  onUpdateCampaign?: (updated: EmailCampaign) => void;
}

export const RefinementAssistant: React.FC<RefinementAssistantProps> = ({
  onRefine,
  isRefining,
  campaign,
  onUpdateCampaign,
}) => {
  const [instruction, setInstruction] = useState("");
  const [showSendTimeModal, setShowSendTimeModal] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Auto-Detect");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optError, setOptError] = useState<string | null>(null);

  const QUICK_REFINEMENTS = [
    { label: "⚡ Make Shorter & Punchier", prompt: "Shorten all body paragraphs and make subject lines punchier under 40 characters." },
    { label: "🔥 Increase Urgency", prompt: "Inject more FOMO and urgency regarding limited stock and countdown deadline." },
    { label: "💬 More Conversational Tone", prompt: "Rewrite copy in a friendly, warm, conversational tone as if speaking directly to a friend." },
    { label: "🎁 Highlight Discount Code", prompt: "Emphasize the discount offer and promo code in a prominent callout box." },
    { label: "🛡️ Spam Proof Copy", prompt: "Replace salesy trigger words with deliverability-friendly phrasing." },
  ];

  const INDUSTRIES = [
    "Auto-Detect",
    "E-Commerce / Retail",
    "B2B SaaS / Tech",
    "Creator / Substack / Newsletter",
    "Finance & Fintech",
    "Healthcare & Wellness",
    "Local Business & Services",
    "Education & Online Courses",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining) return;
    onRefine(instruction.trim());
    setInstruction("");
  };

  const handleSelectQuick = (promptText: string) => {
    if (isRefining) return;
    onRefine(promptText);
  };

  const handleOptimizeSendTime = async () => {
    if (!campaign) return;
    setIsOptimizing(true);
    setOptError(null);

    try {
      const response = await fetch("/api/campaign/optimize-sendtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign,
          overrideIndustry: selectedIndustry !== "Auto-Detect" ? selectedIndustry : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize send time.");
      }

      const data = await response.json();
      if (data.success && data.recommendation && onUpdateCampaign) {
        const updated: EmailCampaign = {
          ...campaign,
          sendTimeRecommendation: data.recommendation,
        };
        onUpdateCampaign(updated);
      }
    } catch (err: any) {
      console.error("Error optimizing send time:", err);
      setOptError(err.message || "Optimization request failed.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const currentRec = campaign?.sendTimeRecommendation;

  return (
    <div id="refinement-assistant-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 text-slate-100 shadow-xl">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <span>AI Campaign Co-Pilot</span>
            </h3>
            <p className="text-xs text-slate-400">Tweak copy, tone, structure, or send-time schedule in real-time</p>
          </div>
        </div>

        {/* Send-Time Optimizer Trigger Button */}
        <button
          onClick={() => {
            setShowSendTimeModal(true);
            if (!currentRec && campaign) {
              handleOptimizeSendTime();
            }
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center space-x-2 shrink-0 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300"
        >
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>
            {currentRec ? `Send Window: ${currentRec.recommendedDateTime}` : "📅 Send-Time Optimizer"}
          </span>
        </button>
      </div>

      {/* Active Send Time Metadata Badge if attached */}
      {currentRec && (
        <div className="mb-4 bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Optimal Send Window: {currentRec.recommendedDateTime}</span>
              <p className="text-[11px] text-purple-300">{currentRec.industry} • {currentRec.engagementBoost}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSendTimeModal(true)}
            className="text-[11px] font-semibold text-purple-300 hover:text-white underline self-start sm:self-auto"
          >
            Adjust Schedule
          </button>
        </div>
      )}

      {/* Quick Refinement Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_REFINEMENTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isRefining}
            onClick={() => handleSelectQuick(item.prompt)}
            className="text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition duration-150 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Custom Refinement Prompt Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g., 'Add a customer review quote section' or 'Make subject line more playful'..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          disabled={isRefining}
        />
        <button
          type="submit"
          disabled={!instruction.trim() || isRefining}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md disabled:opacity-50 transition"
        >
          {isRefining ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refine</span>
            </>
          )}
        </button>
      </form>

      {/* SEND-TIME OPTIMIZER MODAL */}
      {showSendTimeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            
            <button
              onClick={() => setShowSendTimeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Send-Time Optimizer</h3>
                <p className="text-xs text-slate-400">Industry benchmark timing for maximum open rates</p>
              </div>
            </div>

            {/* Industry Selector */}
            <div className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Industry Category Benchmark</span>
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  {INDUSTRIES.map((ind, i) => (
                    <option key={i} value={ind}>{ind}</option>
                  ))}
                </select>
                <button
                  onClick={handleOptimizeSendTime}
                  disabled={isOptimizing}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-1 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? "animate-spin" : ""}`} />
                  <span>Analyze</span>
                </button>
              </div>
            </div>

            {optError && (
              <div className="text-xs text-red-400 mb-3 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {optError}
              </div>
            )}

            {/* Optimization Results */}
            {isOptimizing ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Analyzing industry open rate velocity & peak subscriber habits...</p>
              </div>
            ) : currentRec ? (
              <div className="space-y-4">
                
                <div className="bg-gradient-to-r from-purple-950/60 to-slate-950 p-4 rounded-xl border border-purple-500/40 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-300 block mb-1">
                    Recommended Dispatch Window
                  </span>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {currentRec.recommendedDateTime}
                  </div>
                  <div className="inline-block mt-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    ⚡ {currentRec.engagementBoost}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">Peak Days</span>
                    <div className="flex flex-wrap gap-1">
                      {currentRec.bestDays?.map((day, dIdx) => (
                        <span key={dIdx} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[11px] font-bold">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">Best Time Windows</span>
                    <div className="flex flex-wrap gap-1">
                      {currentRec.bestTimeSlots?.map((slot, sIdx) => (
                        <span key={sIdx} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[11px] font-bold">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-200 block mb-1">Industry Rationale:</span>
                  {currentRec.reasoning}
                </div>

              </div>
            ) : null}

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSendTimeModal(false)}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Save Schedule Metadata
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
