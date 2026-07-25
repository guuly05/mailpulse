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
  MousePointerClick,
  Palette,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";

interface SplitTestComparatorProps {
  campaign: EmailCampaign;
  onUpdateCampaign: (updated: EmailCampaign) => void;
  onGenerateVariantB: (strategy: string) => void;
  isGeneratingVariant: boolean;
  onRegenerateImageB?: (prompt: string) => void;
  isGeneratingImageB?: boolean;
}

const COLOR_PRESETS = [
  { name: "Brand Blue", hex: "#3b82f6" },
  { name: "High-Vis Orange", hex: "#f97316" },
  { name: "Conversion Green", hex: "#10b981" },
  { name: "Vibrant Purple", hex: "#8b5cf6" },
  { name: "Urgency Red", hex: "#ef4444" },
  { name: "Midnight Slate", hex: "#0f172a" },
];

interface SimulatedCTRMetrics {
  predictedCTR: number;
  predictedCTOR: number;
  scoreRating: "Optimal" | "Strong" | "Average" | "Needs Boost";
  boostReason: string;
  badgeClass: string;
}

function calculateSimulatedPerformance(
  ctaText: string,
  ctaColor?: string,
  openRateScore: number = 85,
  defaultColor: string = "#3b82f6"
): SimulatedCTRMetrics {
  const openScore = Math.max(50, openRateScore || 85);
  let baseCTR = (openScore / 100) * 4.2;

  const text = (ctaText || "").toLowerCase();
  const color = (ctaColor || defaultColor).toLowerCase();

  // Action / Power words bonus
  const powerWords = [
    "get",
    "claim", "unlock",
    "start",
    "free",
    "now",
    "my",
    "save",
    "discount",
    "access",
    "instant",
    "grab",
    "join",
    "try",
    "shop",
  ];
  let powerWordBonus = 0;
  powerWords.forEach((word) => {
    if (text.includes(word)) powerWordBonus += 0.4;
  });
  powerWordBonus = Math.min(1.6, powerWordBonus);

  // Conciseness Bonus
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  let lengthBonus = 0;
  if (wordCount >= 2 && wordCount <= 5) {
    lengthBonus = 0.6;
  } else if (wordCount === 1) {
    lengthBonus = 0.2;
  }

  // Color Contrast / Visibility Bonus
  let colorBonus = 0.3;
  if (color.includes("f97316") || color.includes("orange")) {
    colorBonus = 1.25; // High visibility contrast
  } else if (color.includes("10b981") || color.includes("emerald") || color.includes("green")) {
    colorBonus = 1.1;
  } else if (color.includes("8b5cf6") || color.includes("purple")) {
    colorBonus = 0.7;
  } else if (color.includes("ef4444") || color.includes("red")) {
    colorBonus = 0.8;
  }

  const predictedCTR = Number((baseCTR + powerWordBonus + lengthBonus + colorBonus).toFixed(1));
  const predictedCTOR = Number(((predictedCTR / (openScore / 100)) * 4.2).toFixed(1));

  let scoreRating: "Optimal" | "Strong" | "Average" | "Needs Boost" = "Average";
  let badgeClass = "bg-slate-800 text-slate-300 border-slate-700";
  let boostReason = "Standard expected click performance.";

  if (predictedCTR >= 6.4) {
    scoreRating = "Optimal";
    badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    boostReason = "High-contrast CTA color & direct value verbs maximize click intent.";
  } else if (predictedCTR >= 5.0) {
    scoreRating = "Strong";
    badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    boostReason = "Action-oriented phrasing with solid visual hierarchy.";
  } else if (predictedCTR >= 3.8) {
    scoreRating = "Average";
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    boostReason = "Consider testing high-vis orange/green or first-person verbs ('Get My Discount').";
  } else {
    scoreRating = "Needs Boost";
    badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    boostReason = "Passive CTA label. Test urgent action verbs or high-visibility colors.";
  }

  return {
    predictedCTR,
    predictedCTOR,
    scoreRating,
    boostReason,
    badgeClass,
  };
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

  const handleUpdateCTATextA = (text: string) => {
    onUpdateCampaign({
      ...campaign,
      primaryCTA: {
        ...campaign.primaryCTA,
        text,
      },
    });
  };

  const handleUpdateCTAColorA = (buttonColor: string) => {
    onUpdateCampaign({
      ...campaign,
      primaryCTA: {
        ...campaign.primaryCTA,
        buttonColor,
      },
    });
  };

  const handleUpdateCTATextB = (text: string) => {
    if (!variantB) return;
    onUpdateCampaign({
      ...campaign,
      variantB: {
        ...variantB,
        primaryCTA: {
          ...variantB.primaryCTA,
          text,
        },
      },
    });
  };

  const handleUpdateCTAColorB = (buttonColor: string) => {
    if (!variantB) return;
    onUpdateCampaign({
      ...campaign,
      variantB: {
        ...variantB,
        primaryCTA: {
          ...variantB.primaryCTA,
          buttonColor,
        },
      },
    });
  };

  const currentSubjectA =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text || campaign.subjectLines[0]?.text;
  const currentSubjectB =
    variantB?.subjectLines[variantB.selectedSubjectIndex]?.text || variantB?.subjectLines[0]?.text;

  const ctaColorA = campaign.primaryCTA.buttonColor || campaign.primaryColor || "#3b82f6";
  const ctaColorB = variantB?.primaryCTA?.buttonColor || "#f97316";

  const openRateA = campaign.subjectLines[campaign.selectedSubjectIndex]?.openRateScore || 85;
  const metricsA = calculateSimulatedPerformance(campaign.primaryCTA.text, ctaColorA, openRateA, campaign.primaryColor);

  const openRateB = variantB?.subjectLines[variantB?.selectedSubjectIndex || 0]?.openRateScore || 88;
  const metricsB = variantB
    ? calculateSimulatedPerformance(variantB.primaryCTA.text, ctaColorB, openRateB, "#f97316")
    : null;

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

                  {/* CTA & Color A/B Testing Box */}
                  <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <MousePointerClick className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">CTA Button Customizer</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Variant A Control</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">CTA Button Label</label>
                        <input
                          type="text"
                          value={campaign.primaryCTA.text}
                          onChange={(e) => handleUpdateCTATextA(e.target.value)}
                          placeholder="e.g. Claim My 20% Discount"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium flex items-center justify-between">
                          <span>CTA Button Color</span>
                          <span className="text-[10px] font-mono" style={{ color: ctaColorA }}>{ctaColorA}</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              title={preset.name}
                              onClick={() => handleUpdateCTAColorA(preset.hex)}
                              className={`w-6 h-6 rounded-full border transition transform hover:scale-110 flex items-center justify-center ${
                                ctaColorA.toLowerCase() === preset.hex.toLowerCase()
                                  ? "border-white ring-2 ring-blue-500 scale-105"
                                  : "border-slate-700 hover:border-slate-400"
                              }`}
                              style={{ backgroundColor: preset.hex }}
                            >
                              {ctaColorA.toLowerCase() === preset.hex.toLowerCase() && (
                                <Check className="w-3 h-3 text-white drop-shadow" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1 text-center">
                        <button
                          style={{ backgroundColor: ctaColorA }}
                          className="px-5 py-2 rounded-lg text-white font-bold text-xs shadow-md transition transform active:scale-95 inline-flex items-center space-x-1.5"
                        >
                          <span>{campaign.primaryCTA.text || "Click Here"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Simulated Performance Widget */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                          <span>Simulated Performance</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${metricsA.badgeClass}`}>
                          {metricsA.scoreRating}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block">Predicted CTR</span>
                          <div className="text-base font-extrabold text-blue-400 font-mono flex items-baseline space-x-1">
                            <span>{metricsA.predictedCTR}%</span>
                            <span className="text-[10px] text-slate-500 font-normal">clicks</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (metricsA.predictedCTR / 10) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block">Click-to-Open</span>
                          <div className="text-base font-extrabold text-purple-400 font-mono">
                            {metricsA.predictedCTOR}%
                          </div>
                          <span className="text-[9px] text-slate-500 block mt-0.5">Est. CTOR rate</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60 leading-tight">
                        💡 {metricsA.boostReason}
                      </p>
                    </div>
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

                  {/* CTA & Color A/B Testing Box B */}
                  <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <MousePointerClick className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">CTA Button Customizer</span>
                      </div>
                      <span className="text-[10px] text-indigo-300 font-mono">Variant B Challenger</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">CTA Button Label</label>
                        <input
                          type="text"
                          value={variantB.primaryCTA.text}
                          onChange={(e) => handleUpdateCTATextB(e.target.value)}
                          placeholder="e.g. Unlock My Free Access"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium flex items-center justify-between">
                          <span>CTA Button Color</span>
                          <span className="text-[10px] font-mono" style={{ color: ctaColorB }}>{ctaColorB}</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              title={preset.name}
                              onClick={() => handleUpdateCTAColorB(preset.hex)}
                              className={`w-6 h-6 rounded-full border transition transform hover:scale-110 flex items-center justify-center ${
                                ctaColorB.toLowerCase() === preset.hex.toLowerCase()
                                  ? "border-white ring-2 ring-indigo-500 scale-105"
                                  : "border-slate-700 hover:border-slate-400"
                              }`}
                              style={{ backgroundColor: preset.hex }}
                            >
                              {ctaColorB.toLowerCase() === preset.hex.toLowerCase() && (
                                <Check className="w-3 h-3 text-white drop-shadow" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1 text-center">
                        <button
                          style={{ backgroundColor: ctaColorB }}
                          className="px-5 py-2 rounded-lg text-white font-bold text-xs shadow-md transition transform active:scale-95 inline-flex items-center space-x-1.5"
                        >
                          <span>{variantB.primaryCTA.text || "Click Here"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Simulated Performance Widget */}
                    {metricsB && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Simulated Performance</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${metricsB.badgeClass}`}>
                            {metricsB.scoreRating}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Predicted CTR</span>
                            <div className="text-base font-extrabold text-indigo-400 font-mono flex items-baseline space-x-1">
                              <span>{metricsB.predictedCTR}%</span>
                              <span className="text-[10px] text-slate-500 font-normal">clicks</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (metricsB.predictedCTR / 10) * 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Click-to-Open</span>
                            <div className="text-base font-extrabold text-purple-400 font-mono">
                              {metricsB.predictedCTOR}%
                            </div>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Est. CTOR rate</span>
                          </div>
                        </div>

                        {/* Comparative Delta Badge */}
                        {(() => {
                          const delta = Number((metricsB.predictedCTR - metricsA.predictedCTR).toFixed(1));
                          const percentChange = metricsA.predictedCTR > 0
                            ? Math.round((delta / metricsA.predictedCTR) * 100)
                            : 0;

                          if (delta > 0) {
                            return (
                              <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-lg text-emerald-300 text-[11px] font-semibold flex items-center space-x-1.5">
                                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>⚡ Predicts <strong>+{percentChange}% higher CTR</strong> (+{delta}% absolute) than Variant A!</span>
                              </div>
                            );
                          } else if (delta < 0) {
                            return (
                              <div className="bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg text-amber-300 text-[11px] font-semibold flex items-center space-x-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Variant A holds a {Math.abs(delta)}% predicted CTR advantage over Variant B.</span>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60 leading-tight">
                          💡 {metricsB.boostReason}
                        </p>
                      </div>
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
                    <td className="p-2.5 font-medium text-slate-400">Primary CTA Label</td>
                    <td className="p-2.5 font-bold text-white">{campaign.primaryCTA.text}</td>
                    <td className="p-2.5 font-bold text-white">{variantB.primaryCTA.text}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">CTA Button Color</td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: ctaColorA }} />
                        <span className="font-mono text-[11px] text-slate-200">{ctaColorA}</span>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: ctaColorB }} />
                        <span className="font-mono text-[11px] text-slate-200">{ctaColorB}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-400">Simulated CTR (Click-Through)</td>
                    <td className="p-2.5 font-mono font-bold text-blue-400">
                      {metricsA.predictedCTR}% <span className="text-[10px] font-normal text-slate-400">({metricsA.scoreRating})</span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-indigo-400">
                      {metricsB?.predictedCTR}% <span className="text-[10px] font-normal text-slate-400">({metricsB?.scoreRating})</span>
                    </td>
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
