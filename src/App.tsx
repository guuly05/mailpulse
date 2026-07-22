import React, { useState, useEffect } from "react";
import { EmailCampaign, CampaignGenerationOptions } from "./types";
import { Header } from "./components/Header";
import { CampaignWizard } from "./components/CampaignWizard";
import { SubjectLineSelector } from "./components/SubjectLineSelector";
import { EmailPreview } from "./components/EmailPreview";
import { RefinementAssistant } from "./components/RefinementAssistant";
import { SpamCheckModal } from "./components/SpamCheckModal";
import { ExportModal } from "./components/ExportModal";
import { SavedCampaignsDrawer } from "./components/SavedCampaignsDrawer";
import { Sparkles, AlertCircle, RefreshCw, Wand2 } from "lucide-react";

const LOCAL_STORAGE_KEY = "mailpulse_saved_campaigns_v1";

export default function App() {
  const [savedCampaigns, setSavedCampaigns] = useState<EmailCampaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<EmailCampaign | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSpamModal, setShowSpamModal] = useState(false);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedCampaigns(parsed);
          setActiveCampaign(parsed[0]);
        }
      }
    } catch (err) {
      console.error("Failed to parse saved campaigns:", err);
    }
  }, []);

  // Save campaigns to localStorage whenever list changes
  const saveCampaignsList = (list: EmailCampaign[]) => {
    setSavedCampaigns(list);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Failed to save campaigns:", err);
    }
  };

  const saveOrUpdateActiveCampaign = (campaign: EmailCampaign) => {
    setActiveCampaign(campaign);
    const existingIndex = savedCampaigns.findIndex((c) => c.id === campaign.id);
    let newList: EmailCampaign[];
    if (existingIndex >= 0) {
      newList = [...savedCampaigns];
      newList[existingIndex] = campaign;
    } else {
      newList = [campaign, ...savedCampaigns];
    }
    saveCampaignsList(newList);
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = savedCampaigns.filter((c) => c.id !== id);
    saveCampaignsList(updated);
    if (activeCampaign?.id === id) {
      setActiveCampaign(updated.length > 0 ? updated[0] : null);
    }
  };

  // Generate new campaign via backend endpoint
  const handleGenerateCampaign = async (options: CampaignGenerationOptions) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/campaign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate campaign.");
      }

      const data = await response.json();
      if (!data.success || !data.campaign) {
        throw new Error("Invalid response format from campaign generator server.");
      }

      const rawCampaign = data.campaign;

      // Construct full campaign object
      const newCampaign: EmailCampaign = {
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: Date.now(),
        campaignTitle: rawCampaign.campaignTitle || "New Campaign",
        subjectLines: rawCampaign.subjectLines || [],
        selectedSubjectIndex: 0,
        previewText: rawCampaign.previewText || "",
        heroImagePrompt: rawCampaign.heroImagePrompt || options.prompt,
        headline: rawCampaign.headline || "Exclusive Offer Inside",
        subheadline: rawCampaign.subheadline || "",
        bodyParagraphs: rawCampaign.bodyParagraphs || [],
        keyHighlights: rawCampaign.keyHighlights || [],
        primaryCTA: rawCampaign.primaryCTA || { text: options.ctaText, url: "#" },
        promoOffer: rawCampaign.promoOffer,
        secondarySection: rawCampaign.secondarySection,
        footer: rawCampaign.footer || {
          companyName: options.brandName,
          address: "123 Business Way, Suite 400, San Francisco, CA 94107",
        },
        spamScoreAnalysis: rawCampaign.spamScoreAnalysis || {
          score: 92,
          grade: "A",
          triggerWordsFound: [],
          recommendations: ["Keep image-to-text ratio balanced."],
        },
        brandName: options.brandName,
        primaryColor: options.primaryColor || "#2563eb",
        backgroundColor: "#ffffff",
        textColor: "#334155",
        visualStyle: options.visualStyle,
      };

      saveOrUpdateActiveCampaign(newCampaign);

      // Trigger hero banner AI image generation in background
      if (newCampaign.heroImagePrompt) {
        handleRegenerateBannerImage(newCampaign, newCampaign.heroImagePrompt);
      }

      // Scroll smoothly to campaign preview
      setTimeout(() => {
        const previewEl = document.getElementById("subject-line-selector-card");
        if (previewEl) {
          previewEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);

    } catch (err: any) {
      console.error("Error generating campaign:", err);
      setErrorMessage(err.message || "Something went wrong while generating the campaign.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Banner AI Image
  const handleRegenerateBannerImage = async (targetCampaign: EmailCampaign, imagePrompt: string) => {
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/campaign/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio: "16:9" }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        const updated: EmailCampaign = {
          ...targetCampaign,
          heroImageUrl: data.imageUrl,
          heroImagePrompt: imagePrompt,
        };
        saveOrUpdateActiveCampaign(updated);
      }
    } catch (err) {
      console.error("Image generation failed:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Refine Campaign via AI Co-Pilot
  const handleRefineCampaign = async (instruction: string) => {
    if (!activeCampaign) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/campaign/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCampaign: activeCampaign,
          instruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to refine campaign.");
      }

      const data = await response.json();
      if (data.success && data.campaign) {
        const updated: EmailCampaign = {
          ...activeCampaign,
          ...data.campaign,
          // preserve id and timestamp
          id: activeCampaign.id,
          createdAt: activeCampaign.createdAt,
          heroImageUrl: activeCampaign.heroImageUrl,
        };
        saveOrUpdateActiveCampaign(updated);
      }
    } catch (err: any) {
      console.error("Error refining campaign:", err);
      setErrorMessage(err.message || "Failed to refine campaign.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        campaignCount={savedCampaigns.length}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenSpamModal={() => setShowSpamModal(true)}
        onNewCampaign={() => {
          setActiveCampaign(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        hasCampaign={!!activeCampaign}
        spamScore={activeCampaign?.spamScoreAnalysis?.score}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Campaign Wizard Input Section */}
        <CampaignWizard
          onGenerate={handleGenerateCampaign}
          isGenerating={isGenerating}
        />

        {/* Generated Active Campaign Display */}
        {activeCampaign ? (
          <div>
            
            {/* Subject Line & Inbox Preview */}
            <SubjectLineSelector
              subjectLines={activeCampaign.subjectLines}
              selectedIndex={activeCampaign.selectedSubjectIndex}
              onSelectIndex={(idx) => {
                const updated = { ...activeCampaign, selectedSubjectIndex: idx };
                saveOrUpdateActiveCampaign(updated);
              }}
              previewText={activeCampaign.previewText}
              onUpdatePreviewText={(newText) => {
                const updated = { ...activeCampaign, previewText: newText };
                saveOrUpdateActiveCampaign(updated);
              }}
              onUpdateSubjectText={(idx, newText) => {
                const updatedSubjectLines = [...activeCampaign.subjectLines];
                updatedSubjectLines[idx].text = newText;
                const updated = { ...activeCampaign, subjectLines: updatedSubjectLines };
                saveOrUpdateActiveCampaign(updated);
              }}
            />

            {/* AI Co-Pilot Assistant */}
            <RefinementAssistant
              onRefine={handleRefineCampaign}
              isRefining={isRefining}
            />

            {/* Email Canvas Preview */}
            <EmailPreview
              campaign={activeCampaign}
              onUpdateCampaign={(updated) => saveOrUpdateActiveCampaign(updated)}
              onRegenerateImage={(prompt) =>
                handleRegenerateBannerImage(activeCampaign, prompt)
              }
              isGeneratingImage={isGeneratingImage}
            />

          </div>
        ) : (
          /* Empty State Placeholder */
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 bg-slate-900/30">
            <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-300">Ready to build your email campaign</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select a quick preset above or type a description to generate high-converting subject lines, copy, CTAs, and visual banner graphics.
            </p>
          </div>
        )}

      </main>

      {/* Modals & Drawers */}
      {showSpamModal && activeCampaign?.spamScoreAnalysis && (
        <SpamCheckModal
          analysis={activeCampaign.spamScoreAnalysis}
          onClose={() => setShowSpamModal(false)}
        />
      )}

      {showExportModal && activeCampaign && (
        <ExportModal
          campaign={activeCampaign}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showHistoryDrawer && (
        <SavedCampaignsDrawer
          campaigns={savedCampaigns}
          onSelectCampaign={(c) => setActiveCampaign(c)}
          onDeleteCampaign={handleDeleteCampaign}
          onClose={() => setShowHistoryDrawer(false)}
          activeCampaignId={activeCampaign?.id}
        />
      )}

    </div>
  );
}
