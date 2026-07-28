import React, { useState } from "react";
import { EmailCampaign } from "../types";
import {
  Languages,
  Globe,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileText,
  Volume2,
  X,
  Split,
  ChevronRight
} from "lucide-react";

interface CampaignTranslatorProps {
  campaign: EmailCampaign;
  onUpdateCampaign: (updated: EmailCampaign) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
];

export const CampaignTranslator: React.FC<CampaignTranslatorProps> = ({
  campaign,
  onUpdateCampaign,
  isOpen,
  onClose,
}) => {
  const [targetLanguage, setTargetLanguage] = useState<string>("Spanish");
  const [customTone, setCustomTone] = useState<string>(
    campaign.brandTone || "Engaging, authoritative, and persuasive"
  );
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedData, setTranslatedData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"translated" | "comparison">("translated");

  if (!isOpen) return null;

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.name === targetLanguage) || SUPPORTED_LANGUAGES[0];

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError(null);
    try {
      const res = await fetch("/api/campaign/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign,
          targetLanguage,
          customBrandTone: customTone,
        }),
      });

      const data = await res.json();
      if (data.success && data.translatedData) {
        setTranslatedData(data.translatedData);
      } else {
        setError(data.error || "Failed to translate campaign.");
      }
    } catch (err: any) {
      setError(err.message || "Network error translating campaign.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApplyToActive = () => {
    if (!translatedData) return;

    const updated: EmailCampaign = {
      ...campaign,
      campaignTitle: translatedData.campaignTitle || campaign.campaignTitle,
      subjectLines: translatedData.subjectLines || campaign.subjectLines,
      selectedSubjectIndex: 0,
      previewText: translatedData.previewText || campaign.previewText,
      headline: translatedData.headline || campaign.headline,
      subheadline: translatedData.subheadline || campaign.subheadline,
      bodyParagraphs: translatedData.bodyParagraphs || campaign.bodyParagraphs,
      keyHighlights: translatedData.keyHighlights || campaign.keyHighlights,
      primaryCTA: {
        ...campaign.primaryCTA,
        text: translatedData.primaryCTA?.text || campaign.primaryCTA.text,
        secondaryNote: translatedData.primaryCTA?.secondaryNote || campaign.primaryCTA.secondaryNote,
      },
      promoOffer: translatedData.promoOffer
        ? {
            ...campaign.promoOffer,
            badgeText: translatedData.promoOffer.badgeText || campaign.promoOffer?.badgeText,
            offerTitle: translatedData.promoOffer.offerTitle || campaign.promoOffer?.offerTitle,
            expirationNotice: translatedData.promoOffer.expirationNotice || campaign.promoOffer?.expirationNotice,
          }
        : campaign.promoOffer,
      secondarySection: translatedData.secondarySection
        ? {
            ...campaign.secondarySection,
            title: translatedData.secondarySection.title || campaign.secondarySection?.title,
            description: translatedData.secondarySection.description || campaign.secondarySection?.description,
            ctaText: translatedData.secondarySection.ctaText || campaign.secondarySection?.ctaText,
          }
        : campaign.secondarySection,
      footer: translatedData.footer
        ? {
            ...campaign.footer,
            unsubscribeText: translatedData.footer.unsubscribeText || campaign.footer?.unsubscribeText,
          }
        : campaign.footer,
    };

    onUpdateCampaign(updated);
    onClose();
  };

  const handleApplyAsVariantB = () => {
    if (!translatedData) return;

    const variantB = {
      variantName: `Variant B: ${targetLanguage} Localized Copy`,
      hypothesis: `Testing localized ${targetLanguage} email copy against baseline English to improve engagement for international subscribers.`,
      subjectLines: translatedData.subjectLines || campaign.subjectLines,
      selectedSubjectIndex: 0,
      previewText: translatedData.previewText || campaign.previewText,
      heroImagePrompt: campaign.heroImagePrompt,
      heroImageUrl: campaign.heroImageUrl,
      headline: translatedData.headline || campaign.headline,
      subheadline: translatedData.subheadline || campaign.subheadline,
      bodyParagraphs: translatedData.bodyParagraphs || campaign.bodyParagraphs,
      keyHighlights: translatedData.keyHighlights || campaign.keyHighlights,
      primaryCTA: {
        ...campaign.primaryCTA,
        text: translatedData.primaryCTA?.text || campaign.primaryCTA.text,
      },
      promoOffer: translatedData.promoOffer,
      secondarySection: translatedData.secondarySection,
      spamScoreAnalysis: campaign.spamScoreAnalysis,
    };

    const updated: EmailCampaign = {
      ...campaign,
      variantAName: campaign.variantAName || "Variant A (Baseline)",
      variantB,
      isSplitTesting: true,
    };

    onUpdateCampaign(updated);
    onClose();
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">AI Multilingual Copy Translator</h3>
                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automatically translate email copy while strictly preserving brand tone, persuasive hooks & CTAs
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Target Language & Brand Tone Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            
            {/* Target Language Selection */}
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Language</span>
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Preserved Brand Tone Control */}
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Brand Tone to Preserve</span>
              </label>
              <input
                type="text"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="e.g. Friendly, urgent, professional..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Translate Submit Action */}
            <div className="md:col-span-12 pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isTranslating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Translating with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Translate to {selectedLangObj.flag} {targetLanguage}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Translated Content View */}
          {translatedData ? (
            <div className="space-y-5">
              
              {/* Translator Notes Callout */}
              {translatedData.translatorNotes && (
                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 text-xs text-indigo-200 leading-relaxed flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Gemini Localization & Tone Analysis</span>
                    <p className="text-slate-300">{translatedData.translatorNotes}</p>
                  </div>
                </div>
              )}

              {/* View Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("translated")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === "translated"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {selectedLangObj.flag} Translated ({targetLanguage})
                  </button>
                  <button
                    onClick={() => setActiveTab("comparison")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === "comparison"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔄 Side-by-Side Comparison
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      `Subject: ${translatedData.subjectLines?.[0]?.text}\n\n${translatedData.headline}\n${translatedData.subheadline}\n\n${translatedData.bodyParagraphs?.join(
                        "\n\n"
                      )}`,
                      "full"
                    )
                  }
                  className="text-xs text-slate-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  {copiedField === "full" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tab 1: Clean Translated View */}
              {activeTab === "translated" && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  
                  {/* Subject Lines */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Translated Subject Line
                    </span>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-white">{translatedData.subjectLines?.[0]?.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Preview Text: <span className="text-slate-300">{translatedData.previewText}</span>
                        </p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold px-2 py-1 rounded-lg">
                        {translatedData.subjectLines?.[0]?.openRateScore || 90} Score
                      </span>
                    </div>
                  </div>

                  {/* Headline & Subheadline */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Headline & Subheadline
                    </span>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <h4 className="font-bold text-base text-white">{translatedData.headline}</h4>
                      {translatedData.subheadline && (
                        <p className="text-xs text-slate-300 mt-1">{translatedData.subheadline}</p>
                      )}
                    </div>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Body Paragraphs
                    </span>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs leading-relaxed text-slate-200">
                      {translatedData.bodyParagraphs?.map((para: string, idx: number) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Key Highlights */}
                  {translatedData.keyHighlights?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Key Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {translatedData.keyHighlights.map((hl: any, idx: number) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="font-bold text-xs text-white block">{hl.title}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">{hl.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary CTA */}
                  {translatedData.primaryCTA && (
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Translated CTA Button</span>
                        <span className="font-bold text-xs text-indigo-300">{translatedData.primaryCTA.text}</span>
                      </div>
                      <span className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                        {translatedData.primaryCTA.text}
                      </span>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 2: Side-by-Side Comparison */}
              {activeTab === "comparison" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original English */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
                      <span>🇺🇸 Baseline Original</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Subject</span>
                      <p className="text-xs font-semibold text-white">{campaign.subjectLines?.[0]?.text}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Headline</span>
                      <p className="text-xs font-bold text-white">{campaign.headline}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Body Paragraph 1</span>
                      <p className="text-[11px] text-slate-300 leading-normal">{campaign.bodyParagraphs?.[0]}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">CTA Button</span>
                      <p className="text-xs font-bold text-indigo-400">{campaign.primaryCTA?.text}</p>
                    </div>
                  </div>

                  {/* Translated Target */}
                  <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300 pb-2 border-b border-slate-800">
                      <span>{selectedLangObj.flag} {targetLanguage} Localized</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400/70 font-mono block">Subject</span>
                      <p className="text-xs font-semibold text-white">{translatedData.subjectLines?.[0]?.text}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400/70 font-mono block">Headline</span>
                      <p className="text-xs font-bold text-white">{translatedData.headline}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400/70 font-mono block">Body Paragraph 1</span>
                      <p className="text-[11px] text-slate-300 leading-normal">{translatedData.bodyParagraphs?.[0]}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400/70 font-mono block">CTA Button</span>
                      <p className="text-xs font-bold text-indigo-300">{translatedData.primaryCTA?.text}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Empty State before translation */
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Select a Target Language to Begin Translation</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Gemini will re-write all email fields (subject lines, headline, body paragraphs, CTAs, and promo notes) in your target language while keeping your brand voice intact.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        {translatedData && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-4 py-2"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleApplyAsVariantB}
                className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <Split className="w-3.5 h-3.5 text-indigo-400" />
                <span>Save as Variant B (A/B Test)</span>
              </button>

              <button
                type="button"
                onClick={handleApplyToActive}
                className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Apply to Active Campaign</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
