import React from "react";
import { Mail, Sparkles, History, Code, ShieldCheck, PlusCircle, Split, CloudCheck, CloudUpload, CheckCircle2, Save, Bookmark, Languages, Undo2 } from "lucide-react";

interface HeaderProps {
  campaignCount: number;
  onOpenHistory: () => void;
  onOpenBrandLibrary?: () => void;
  onOpenExport: () => void;
  onOpenSpamModal: () => void;
  onOpenSplitTest?: () => void;
  onOpenTranslator?: () => void;
  onNewCampaign: () => void;
  onForceAutoSave?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  undoCount?: number;
  hasCampaign: boolean;
  spamScore?: number;
  hasSplitTest?: boolean;
  saveStatus?: "saved" | "saving" | "idle";
  timeAgoText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  campaignCount,
  onOpenHistory,
  onOpenBrandLibrary,
  onOpenExport,
  onOpenSpamModal,
  onOpenSplitTest,
  onOpenTranslator,
  onNewCampaign,
  onForceAutoSave,
  onUndo,
  canUndo = false,
  undoCount = 0,
  hasCampaign,
  spamScore,
  hasSplitTest,
  saveStatus = "idle",
  timeAgoText = "Draft saved",
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewCampaign}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MailPulse</span>
              <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Email Campaign & Visual Generator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {hasCampaign && (
            <>
              {/* Global Undo Button */}
              {onUndo && (
                <button
                  id="header-undo-btn"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    canUndo
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-sm cursor-pointer"
                      : "bg-slate-950 text-slate-600 border-slate-800/80 opacity-50 cursor-not-allowed"
                  }`}
                  title={canUndo ? `Revert to previous version (${undoCount}/5 saved) — Ctrl+Z` : "No changes to undo"}
                >
                  <Undo2 className={`w-4 h-4 ${canUndo ? "text-amber-400" : "text-slate-600"}`} />
                  <span className="hidden sm:inline">Undo</span>
                  {canUndo && undoCount > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                      {undoCount}
                    </span>
                  )}
                </button>
              )}

              {/* Auto-Save Indicator Badge */}
              <button
                onClick={onForceAutoSave}
                title="Draft automatically saved to local browser storage"
                className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white transition"
              >
                {saveStatus === "saving" ? (
                  <>
                    <CloudUpload className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span className="text-blue-400 font-semibold">Auto-saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-400">{timeAgoText || "Draft saved"}</span>
                  </>
                )}
              </button>

              {/* Deliverability / Spam Score Badge */}
              {spamScore !== undefined && (
                <button
                  id="header-spam-check-btn"
                  onClick={onOpenSpamModal}
                  className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    spamScore >= 80
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                  }`}
                  title="View Deliverability & Spam Analysis"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Spam Score: {spamScore}/100</span>
                </button>
              )}

              {/* A/B Split Test Button */}
              {onOpenSplitTest && (
                <button
                  id="header-split-test-btn"
                  onClick={onOpenSplitTest}
                  className="flex items-center space-x-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  title="A/B Split Test Campaign"
                >
                  <Split className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">A/B Split Test</span>
                  {hasSplitTest && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  )}
                </button>
              )}

              {/* Translate Copy Button */}
              {onOpenTranslator && (
                <button
                  id="header-translate-btn"
                  onClick={onOpenTranslator}
                  className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  title="Translate email copy with Gemini AI while preserving brand tone"
                >
                  <Languages className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline">Translate</span>
                </button>
              )}

              {/* Export HTML Button */}
              <button
                id="header-export-btn"
                onClick={onOpenExport}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Export Email HTML</span>
                <span className="sm:hidden">Export</span>
              </button>
            </>
          )}

          {/* New Campaign Button */}
          <button
            id="header-new-campaign-btn"
            onClick={onNewCampaign}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">New Campaign</span>
          </button>

          {/* Brand Asset Library Drawer Toggle */}
          {onOpenBrandLibrary && (
            <button
              id="header-brand-library-btn"
              onClick={onOpenBrandLibrary}
              className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              title="Brand Asset Library (Colors, Voice & Signatures)"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Brand Library</span>
            </button>
          )}

          {/* History Drawer Toggle */}
          <button
            id="header-history-btn"
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            title="Saved Campaigns"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Saved</span>
            {campaignCount > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {campaignCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
