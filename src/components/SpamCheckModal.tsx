import React, { useState, useEffect } from "react";
import { SpamScoreAnalysis, DeliverabilityTipsData, GroundingSource } from "../types";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  Globe,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  Award,
  Layers,
  Lock,
  Users,
  TrendingUp,
} from "lucide-react";

interface SpamCheckModalProps {
  analysis: SpamScoreAnalysis;
  onClose: () => void;
}

export const SpamCheckModal: React.FC<SpamCheckModalProps> = ({
  analysis,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"audit" | "tips">("audit");
  const [tipsData, setTipsData] = useState<DeliverabilityTipsData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  const isGood = analysis.score >= 80;

  // Fallback deliverability tips in case search grounded API call takes time or fails
  const DEFAULT_TIPS: DeliverabilityTipsData = {
    summary:
      "Modern email providers like Google, Yahoo, and Apple require strict domain authentication (SPF/DKIM/DMARC) and spam complaint rates under 0.10%.",
    categories: [
      {
        title: "Domain Authentication & DMARC",
        tips: [
          "Publish exact SPF, DKIM, and DMARC DNS records with domain alignment across envelope-from and headers.",
          "Progress DMARC policy from 'p=none' to 'p=quarantine' or 'p=reject' to protect your domain reputation.",
        ],
      },
      {
        title: "Sender Reputation & Spam Rates",
        tips: [
          "Keep spam complaint rates strictly under 0.10% (less than 1 spam mark per 1,000 delivered emails).",
          "Warm up new IP addresses or subdomains gradually over 4-6 weeks with double opt-in subscribers.",
        ],
      },
      {
        title: "List Hygiene & Unsubscribes",
        tips: [
          "Include RFC 8058 compliant one-click list-unsubscribe headers for instant subscriber opt-out.",
          "Run automated sunset workflows to suppress subscribers who haven't opened in 90+ days.",
        ],
      },
      {
        title: "Content & Tracking Security",
        tips: [
          "Use custom tracking domains matching your primary sending domain instead of shared link shorteners.",
          "Maintain a balanced 60:40 text-to-image ratio with clean HTML markup.",
        ],
      },
    ],
  };

  const fetchDeliverabilityTips = async () => {
    setIsLoadingTips(true);
    setTipsError(null);
    try {
      const response = await fetch("/api/campaign/deliverability-tips");
      if (!response.ok) {
        throw new Error("Failed to fetch grounded tips");
      }
      const data = await response.json();
      if (data.success && data.tips) {
        setTipsData(data.tips);
        setSources(data.sources || []);
      } else {
        setTipsData(DEFAULT_TIPS);
      }
    } catch (err: any) {
      console.error("Error loading deliverability tips:", err);
      setTipsData(DEFAULT_TIPS);
      setTipsError("Loaded cached industry deliverability standards.");
    } finally {
      setIsLoadingTips(false);
    }
  };

  useEffect(() => {
    fetchDeliverabilityTips();
  }, []);

  const activeTips = tipsData || DEFAULT_TIPS;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-3 mb-4 shrink-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
              isGood
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isGood ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deliverability & Sender Reputation Audit</h3>
            <p className="text-xs text-slate-400">Analysis & live search-grounded sender best practices</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2 ${
              activeTab === "audit"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Campaign Audit ({analysis.score}/100)</span>
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2 ${
              activeTab === "tips"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4 text-purple-300" />
            <span>Grounded Deliverability Tips</span>
            {sources.length > 0 && (
              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                {sources.length} sources
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          
          {/* TAB 1: CAMPAIGN AUDIT & SPAM SCORE */}
          {activeTab === "audit" && (
            <div className="space-y-5">
              
              {/* Score & Grade Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Inbox Deliverability Score
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span
                      className={`text-3xl font-extrabold font-mono ${
                        isGood ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {analysis.score}/100
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Grade: {analysis.grade || (isGood ? "A" : "B")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                      isGood
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {isGood ? "Primary Inbox Ready" : "Minor Spam Risk"}
                  </span>
                </div>
              </div>

              {/* Trigger Words Section */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Identified Spam Trigger Words</span>
                </h4>
                {analysis.triggerWordsFound && analysis.triggerWordsFound.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.triggerWordsFound.map((word, idx) => (
                      <span
                        key={idx}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded-md font-mono"
                      >
                        "{word}"
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No high-risk spam trigger words detected in email copy!</span>
                  </p>
                )}
              </div>

              {/* Actionable Campaign Recommendations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Campaign Specific Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations?.map((rec, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start space-x-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800"
                    >
                      <span className="text-blue-400 font-bold shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: SEARCH-GROUNDED DELIVERABILITY TIPS & REPUTATION */}
          {activeTab === "tips" && (
            <div className="space-y-5">
              
              {/* Header Box with Search Grounding Badge */}
              <div className="bg-gradient-to-r from-purple-950/40 to-slate-950 p-4 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-500/20 text-purple-300 p-1.5 rounded-lg border border-purple-500/30">
                      <Search className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Google Search Grounded Standards</h4>
                  </div>
                  <button
                    onClick={fetchDeliverabilityTips}
                    disabled={isLoadingTips}
                    className="text-xs text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingTips ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTips.summary}
                </p>

                {tipsError && (
                  <p className="text-[11px] text-amber-400 mt-2 italic">{tipsError}</p>
                )}
              </div>

              {/* Loading Spinner */}
              {isLoadingTips ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold">Querying live email deliverability best practices...</p>
                </div>
              ) : (
                /* Tips Grid Categories */
                <div className="grid grid-cols-1 gap-3.5">
                  {activeTips.categories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
                    >
                      <h5 className="font-bold text-xs uppercase text-purple-300 tracking-wider mb-2 flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        <span>{cat.title}</span>
                      </h5>
                      <ul className="space-y-2">
                        {cat.tips.map((tip, tIdx) => (
                          <li
                            key={tIdx}
                            className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed"
                          >
                            <span className="text-purple-400 font-bold shrink-0">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Grounding Web References / Citations */}
              {sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-purple-400" />
                    <span>Verified Search Grounding Citations & Sources</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition max-w-xs truncate"
                      >
                        <span className="truncate">{src.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center shrink-0 mt-4">
          <span className="text-[11px] text-slate-500">
            Audit standard: RFC 5322 & Google/Yahoo Bulk Sender Requirements
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
