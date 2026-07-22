import React, { useState } from "react";
import { Sparkles, Send, Zap, MessageSquareQuote, ShieldAlert, Globe, Clock, Scissors } from "lucide-react";

interface RefinementAssistantProps {
  onRefine: (instruction: string) => void;
  isRefining: boolean;
}

export const RefinementAssistant: React.FC<RefinementAssistantProps> = ({
  onRefine,
  isRefining,
}) => {
  const [instruction, setInstruction] = useState("");

  const QUICK_REFINEMENTS = [
    { label: "⚡ Make Shorter & Punchier", prompt: "Shorten all body paragraphs and make subject lines punchier under 40 characters." },
    { label: "🔥 Increase Urgency", prompt: "Inject more FOMO and urgency regarding limited stock and countdown deadline." },
    { label: "💬 More Conversational Tone", prompt: "Rewrite copy in a friendly, warm, conversational tone as if speaking directly to a friend." },
    { label: "🎁 Highlight Discount Code", prompt: "Emphasize the discount offer and promo code prominent callout box." },
    { label: "🛡️ Spam Proof Copy", prompt: "Replace salesy trigger words with deliverability-friendly phrasing." },
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

  return (
    <div id="refinement-assistant-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 text-slate-100">
      
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white">AI Campaign Co-Pilot</h3>
          <p className="text-xs text-slate-400">Tweak copy, tone, structure, or framing in real-time</p>
        </div>
      </div>

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

    </div>
  );
};
