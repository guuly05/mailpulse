import React, { useState } from "react";
import { EmailCampaign, CampaignVariant, SubjectLine } from "../types";
import {
  Split,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Flame,
  HelpCircle,
  Target,
  RefreshCw,
  Wand2,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Layers,
  ArrowLeftRight,
} from "lucide-react";

interface SplitTestComparatorProps {
  campaign: EmailCampaign;
  onUpdateCampaign: (updated: EmailCampaign) => void;
  onGenerateVariantB: (strategy: string) => void;
  isGeneratingVariant: boolean;
  onRegenerateImageB?: (prompt: string) => void;
  isGeneratingImageB?: boolean;
}

export const SplitTestComparator: React.FC<SplitTestComparatorProps> = ({
  campaign,
  onUpdateCampaign,
  onGenerateVariantB,
  isGeneratingVariant,
  onRegenerateImageB,
  isGeneratingImageB,
}) => {
  const [customStrategy, setCustomStrategy] = useState("");
  const [activeTab, setActiveTab] = useState<"side-by-side" | "variantA" | "variantB">("side-by-side");
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const variantB = campaign.variantB;

  const STRATEGY_PRESETS = [
    {
      label: "🔥 Urgency vs 🎁 Benefit",
      strategy: "Test a high-urgency countdown & discount angle against a warm, benefit-first value proposition.",
    },
    {
      label: "❓ Curiosity vs 🎯 Direct CTA",
      strategy: "Test an intriguing curiosity subject line and storytelling body against a direct clear call-to-action.",
    },
    {
      label: "📖 Storytelling vs ⚡ Ultra-Short",
      strategy: "Test a personal brand storytelling narrative against an ultra-concise 3-bullet micro-copy email.",
    },
    {
      label: "💬 Casual vs 👔 Professional",
      strategy: "Test a conversational, friendly founder tone against a polished executive presentation.",
    },
  ];

  const handleSelectWinner = (winner: "A" | "B") => {
    onUpdateCampaign({
      ...campaign,
      winningVariant: winner,
    });
  };

  const handleSelectSubjectA = (index: number) => {
    onUpdateCampaign({
      ...campaign,
      selectedSubjectIndex: index,
    });
  };

  const handleSelectSubjectB = (index: number) => {
    if (!variantB) return;
    onUpdateCampaign({
      ...campaign,
      variantB: {
        ...variantB,
        selectedSubjectIndex: index,
      },
    });
  };

  const currentSubjectA =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text || campaign.subjectLines[0]?.text;
  const currentSubjectB =
    variantB?.subjectLines[variantB.selectedSubjectIndex]?.text || variantB?.subjectLines[0]?.text;

  return (
    <div id="split-test-comparator-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 text-slate-100 shadow-2xl mb-8">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Split className="w-3.5 h-3.5" />
            <span>A/B Split-Testing Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>A/B Campaign Comparison</span>
            {campaign.winningVariant && (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Winner: Variant {campaign.winningVariant}</span>
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Split test subject lines, storytelling hooks, copy length, and CTAs side-by-side to maximize conversion rates.
          </p>
        </div>

        {/* View Switcher Controls */}
        {variantB && (
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab("side-by-side")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "side-by-side"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab("variantA")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "variantA"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Variant A (Control)
            </button>
            <button
              onClick={() => setActiveTab("variantB")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "variantB"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Variant B (Challenger)
            </button>
          </div>
        )}
      </div>

      {/* Generator Bar for Variant B */}
      {!variantB ? (
        <div className="my-6 bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Generate Challenger Variant B</h3>
              <p className="text-xs text-slate-400">AI will reframe copy, test a different hook, and generate alternative subject lines.</p>
            </div>
          </div>

          {/* Quick Strategy Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 my-4">
            {STRATEGY_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGeneratingVariant}
                onClick={() => onGenerateVariantB(p.strategy)}
                className="text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 transition duration-150 disabled:opacity-50"
              >
                <span className="block font-semibold text-xs text-purple-300 mb-1">{p.label}</span>
                <span className="block text-[11px] text-slate-400 line-clamp-2">{p.strategy}</span>
              </button>
            ))}
          </div>

          {/* Custom Strategy Prompt Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customStrategy}
              onChange={(e) => setCustomStrategy(e.target.value)}
              placeholder="Or type a custom hypothesis (e.g. 'Test a 20% discount offer vs free shipping offer')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => onGenerateVariantB(customStrategy || STRATEGY_PRESETS[0].strategy)}
              disabled={isGeneratingVariant}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {isGeneratingVariant ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Variant B...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Variant B</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Re-generate or Strategy Indicator */
        <div className="my-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-purple-400">Hypothesis:</span>
            <span className="text-slate-300 italic">{variantB.hypothesis || "Testing storytelling vs direct offer"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onGenerateVariantB("Test a fresh alternative angle with high urgency")}
              disabled={isGeneratingVariant}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Variant B</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Side-by-Side Comparison Layout */}
      {variantB && (
        <div className="mt-6">
          <div
            className={`grid gap-6 ${
              activeTab === "side-by-side"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {/* COLUMN A: VARIANT A (CONTROL) */}
            {(activeTab === "side-by-side" || activeTab === "variantA") && (
              <div
                className={`bg-slate-950 border rounded-2xl overflow-hidden transition ${
                  campaign.winningVariant === "A"
                    ? "border-amber-500 ring-2 ring-amber-500/40"
                    : "border-slate-800"
                }`}
              >
                {/* Column Header */}
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      A
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">Variant A (Control)</h4>
                      <p className="text-[10px] text-slate-400">Baseline Offer & Copy</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectWinner("A")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      campaign.winningVariant === "A"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{campaign.winningVariant === "A" ? "Winning Variant" : "Select as Winner"}</span>
                  </button>
                </div>

                {/* Variant A Content Card */}
                <div className="p-5 space-y-5">
                  
                  {/* Subject Line Picker */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Subject Line A/B Option
                    </label>
                    <select
                      value={campaign.selectedSubjectIndex}
                      onChange={(e) => handleSelectSubjectA(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                    >
                      {campaign.subjectLines.map((s, idx) => (
                        <option key={idx} value={idx}>
                          [{s.openRateScore}% Open Rate] {s.text}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 italic mt-1">
                      Preview: "{campaign.previewText}"
                    </p>
                  </div>

                  {/* Hero Image Banner */}
                  {campaign.heroImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      <img
                        src={campaign.heroImageUrl}
                        alt="Variant A Visual Banner"
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Headline */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Headline</span>
                    <h5 className="font-extrabold text-base text-white">{campaign.headline}</h5>
                    {campaign.subheadline && (
                      <p className="text-xs text-slate-400 mt-0.5">{campaign.subheadline}</p>
                    )}
                  </div>

                  {/* Body Copy */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Body Copy Narrative</span>
                    <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                      {campaign.bodyParagraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>

                  {/* CTA & Offer */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Call To Action</span>
                      <span className="text-xs font-bold text-white">{campaign.primaryCTA.text}</span>
                    </div>
                    {campaign.promoOffer?.offerCode && (
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                        {campaign.promoOffer.offerCode}
                      </span>
                    )}
                  </div>

                  {/* Spam Score Badge */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Deliverability Grade:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {campaign.spamScoreAnalysis?.score || 90}/100 ({campaign.spamScoreAnalysis?.grade || "A"})
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* COLUMN B: VARIANT B (CHALLENGER) */}
            {(activeTab === "side-by-side" || activeTab === "variantB") && (
              <div
                className={`bg-slate-950 border rounded-2xl overflow-hidden transition ${
                  campaign.winningVariant === "B"
                    ? "border-amber-500 ring-2 ring-amber-500/40"
                    : "border-slate-800"
                }`}
              >
                {/* Column Header */}
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      B
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {variantB.variantName || "Variant B (Challenger)"}
                      </h4>
                      <p className="text-[10px] text-indigo-400">Alternative Angle & Hook</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectWinner("B")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      campaign.winningVariant === "B"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{campaign.winningVariant === "B" ? "Winning Variant" : "Select as Winner"}</span>
                  </button>
                </div>

                {/* Variant B Content Card */}
                <div className="p-5 space-y-5">
                  
                  {/* Subject Line Picker */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Subject Line A/B Option
                    </label>
                    <select
                      value={variantB.selectedSubjectIndex}
                      onChange={(e) => handleSelectSubjectB(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    >
                      {variantB.subjectLines.map((s, idx) => (
                        <option key={idx} value={idx}>
                          [{s.openRateScore}% Open Rate] {s.text}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 italic mt-1">
                      Preview: "{variantB.previewText}"
                    </p>
                  </div>

                  {/* Hero Image Banner */}
                  {variantB.heroImageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      <img
                        src={variantB.heroImageUrl}
                        alt="Variant B Visual Banner"
                        className="w-full h-40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center bg-slate-900/50">
                      <p className="text-xs text-slate-400 mb-2">Variant B Visual Image Prompt</p>
                      <button
                        onClick={() => {
                          if (onRegenerateImageB && variantB.heroImagePrompt) {
                            onRegenerateImageB(variantB.heroImagePrompt);
                          }
                        }}
                        disabled={isGeneratingImageB}
                        className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        {isGeneratingImageB ? "Generating Banner..." : "Generate Variant B Image"}
                      </button>
                    </div>
                  )}

                  {/* Headline */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Headline</span>
                    <h5 className="font-extrabold text-base text-white">{variantB.headline}</h5>
                    {variantB.subheadline && (
                      <p className="text-xs text-slate-400 mt-0.5">{variantB.subheadline}</p>
                    )}
                  </div>

                  {/* Body Copy */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Body Copy Narrative</span>
                    <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                      {variantB.bodyParagraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>

                  {/* CTA & Offer */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Call To Action</span>
                      <span className="text-xs font-bold text-white">{variantB.primaryCTA.text}</span>
                    </div>
                    {variantB.promoOffer?.offerCode && (
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                        {variantB.promoOffer.offerCode}
                      </span>
                    )}
                  </div>

                  {/* Spam Score Badge */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Deliverability Grade:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {variantB.spamScoreAnalysis?.score || 90}/100 ({variantB.spamScoreAnalysis?.grade || "A"})
                    </span>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Quick Comparison Summary Table */}
          <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-white mb-3 flex items-center space-x-2">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
              <span>Split-Test Key Differences Summary</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-2.5">Attribute</th>
                    <th className="p-2.5 text-blue-400">Variant A (Control)</th>
                    <th className="p-2.5 text-indigo-400">Variant B (Challenger)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">Primary Subject Line</td>
                    <td className="p-2.5 font-semibold text-white">{currentSubjectA}</td>
                    <td className="p-2.5 font-semibold text-white">{currentSubjectB}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">Est. Open Rate</td>
                    <td className="p-2.5 font-mono font-bold text-blue-400">
                      {campaign.subjectLines[campaign.selectedSubjectIndex]?.openRateScore || 85}%
                    </td>
                    <td className="p-2.5 font-mono font-bold text-indigo-400">
                      {variantB.subjectLines[variantB.selectedSubjectIndex]?.openRateScore || 90}%
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">Headline</td>
                    <td className="p-2.5">{campaign.headline}</td>
                    <td className="p-2.5">{variantB.headline}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">Primary CTA</td>
                    <td className="p-2.5 font-bold">{campaign.primaryCTA.text}</td>
                    <td className="p-2.5 font-bold">{variantB.primaryCTA.text}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
