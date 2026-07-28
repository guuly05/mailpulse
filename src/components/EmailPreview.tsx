import React, { useState } from "react";
import { EmailCampaign } from "../types";
import { ReadabilityScoreBar } from "./ReadabilityScoreBar";
import { Monitor, Smartphone, RefreshCw, Palette, Image as ImageIcon, Sparkles, Check, Copy, Tag, ExternalLink, ShieldCheck, Flame, AlertCircle, Info } from "lucide-react";

interface SentenceAnalysis {
  text: string;
  wordCount: number;
  level: "easy" | "moderate" | "complex";
  reason: string;
}

function analyzeParagraphSentences(paragraphText: string): {
  sentences: SentenceAnalysis[];
  totalWords: number;
  complexCount: number;
  moderateCount: number;
  easyCount: number;
} {
  const rawSentences = paragraphText.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [paragraphText];
  let totalWords = 0;
  let complexCount = 0;
  let moderateCount = 0;
  let easyCount = 0;

  const sentences: SentenceAnalysis[] = rawSentences.map((s) => {
    const trimmed = s.trim();
    if (!trimmed) return { text: s, wordCount: 0, level: "easy", reason: "" };

    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    totalWords += wordCount;

    const longWords = words.filter((w) => w.replace(/[^a-zA-Z]/g, "").length >= 9);

    let level: "easy" | "moderate" | "complex" = "easy";
    let reason = `${wordCount} words. Short & punchy sentence.`;

    if (wordCount >= 24 || (wordCount >= 18 && longWords.length >= 3)) {
      level = "complex";
      complexCount++;
      reason = `⚠ High Complexity (${wordCount} words, ${longWords.length} long words). Recommend splitting into 2 shorter sentences.`;
    } else if (wordCount >= 15 || longWords.length >= 2) {
      level = "moderate";
      moderateCount++;
      reason = `Moderate length (${wordCount} words). Consider punchier phrasing.`;
    } else {
      easyCount++;
    }

    return {
      text: s,
      wordCount,
      level,
      reason,
    };
  });

  return { sentences, totalWords, complexCount, moderateCount, easyCount };
}

interface EmailPreviewProps {
  campaign: EmailCampaign;
  onUpdateCampaign: (updated: EmailCampaign) => void;
  onRegenerateImage: (prompt: string) => void;
  isGeneratingImage: boolean;
  onOpenContentAudit?: () => void;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  campaign,
  onUpdateCampaign,
  onRegenerateImage,
  isGeneratingImage,
  onOpenContentAudit,
}) => {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [customImagePrompt, setCustomImagePrompt] = useState(campaign.heroImagePrompt || "");
  const [showImagePromptModal, setShowImagePromptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeSubject =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text ||
    campaign.subjectLines[0]?.text ||
    "Campaign Subject";

  const handleCopyCode = () => {
    if (campaign.promoOffer?.offerCode) {
      navigator.clipboard.writeText(campaign.promoOffer.offerCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleColorChange = (newColor: string) => {
    onUpdateCampaign({ ...campaign, primaryColor: newColor });
  };

  const handleHeadlineChange = (val: string) => {
    onUpdateCampaign({ ...campaign, headline: val });
  };

  const handleSubheadlineChange = (val: string) => {
    onUpdateCampaign({ ...campaign, subheadline: val });
  };

  const handleCtaTextChange = (val: string) => {
    onUpdateCampaign({
      ...campaign,
      primaryCTA: { ...campaign.primaryCTA, text: val },
    });
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...campaign.bodyParagraphs];
    updated[index] = val;
    onUpdateCampaign({ ...campaign, bodyParagraphs: updated });
  };

  return (
    <div id="email-preview-wrapper" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 mb-8">
      
      {/* Top Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                deviceMode === "desktop"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop View</span>
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                deviceMode === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile (375px)</span>
            </button>
          </div>

          <button
            onClick={() => setIsEditingMode(!isEditingMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isEditingMode
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
            }`}
          >
            {isEditingMode ? "✓ Done Editing" : "✏️ Edit Copy & Styling"}
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${
              showHeatmap
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Flame className={`w-4 h-4 ${showHeatmap ? "text-amber-400 animate-pulse" : "text-slate-400"}`} />
            <span>{showHeatmap ? "🔥 Heatmap Active" : "🔥 Readability Heatmap"}</span>
          </button>
        </div>

        {/* Color Palette Quick Accent */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 hidden sm:inline">Theme Color:</span>
            <input
              type="color"
              value={campaign.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
          </div>

          {/* Regenerate Visual AI Image Button */}
          <button
            onClick={() => setShowImagePromptModal(true)}
            className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span>Regenerate Banner</span>
          </button>
        </div>
      </div>

      {/* Email Inbox Preview Bar */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-2.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-semibold text-slate-300 shrink-0">From:</span>
          <span className="text-slate-400 truncate">{campaign.brandName} &lt;newsletter@{campaign.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&gt;</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 truncate">
          <span className="font-semibold text-slate-300 shrink-0">Subject:</span>
          <span className="text-slate-200 font-medium truncate">{activeSubject}</span>
        </div>
      </div>

      {/* Flesch-Kincaid Readability Analysis Bar */}
      <div className="px-4 sm:px-8 pt-3 bg-slate-950">
        <ReadabilityScoreBar
          bodyParagraphs={campaign.bodyParagraphs}
          headline={campaign.headline}
          subheadline={campaign.subheadline}
          onOpenContentAudit={onOpenContentAudit}
        />
      </div>

      {/* Readability Heatmap Legend Banner */}
      {showHeatmap && (
        <div className="mx-4 sm:mx-8 mt-3 bg-slate-900 border border-amber-500/40 rounded-xl p-3.5 text-xs text-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400 shrink-0">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-amber-200 text-xs flex items-center space-x-2">
                <span>Sentence Complexity & Readability Heatmap</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hover over highlighted sentences directly on the email body below to view word counts & simplification guidance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="flex items-center space-x-1 bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Easy (≤14 words)</span>
            </span>
            <span className="flex items-center space-x-1 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded border border-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Moderate (15–23 words)</span>
            </span>
            <span className="flex items-center space-x-1 bg-rose-200 text-rose-950 px-2.5 py-0.5 rounded border border-rose-400 font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Complex (≥24 words)</span>
            </span>
          </div>
        </div>
      )}

      {/* Main Email Preview Canvas */}
      <div className="bg-slate-950 p-4 sm:p-8 flex justify-center overflow-x-auto min-h-[600px]">
        
        {/* Email Box Container */}
        <div
          className={`bg-white text-slate-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
            deviceMode === "mobile"
              ? "w-[375px] max-w-[375px] border-8 border-slate-800 rounded-[32px] my-4"
              : "w-full max-w-[600px]"
          }`}
        >
          {/* Email Header / Brand Name */}
          <div className="p-6 text-center border-b border-slate-100 bg-white">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {campaign.brandName}
            </span>
          </div>

          {/* Hero Banner Visual Image */}
          <div className="relative group bg-slate-100">
            {campaign.heroImageUrl ? (
              <img
                src={campaign.heroImageUrl}
                alt={campaign.heroImageAltText || campaign.headline || "Campaign AI Visual"}
                className="w-full h-auto object-cover max-h-[360px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white p-6 text-center">
                <Sparkles className="w-8 h-8 mb-2 opacity-80" />
                <span className="font-bold text-lg">{campaign.headline}</span>
              </div>
            )}

            {/* Hover Action to Regenerate Banner */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-4">
              <button
                onClick={() => setShowImagePromptModal(true)}
                className="bg-white text-slate-900 font-bold px-4 py-2 rounded-xl text-xs shadow-lg flex items-center space-x-2 hover:bg-slate-100 transition"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Regenerate Banner AI Visual</span>
              </button>
            </div>

            {isGeneratingImage && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold">Generating High-Res Visual Banner...</p>
              </div>
            )}
          </div>

          {/* Email Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Headline */}
            <div>
              {isEditingMode ? (
                <input
                  type="text"
                  value={campaign.headline}
                  onChange={(e) => handleHeadlineChange(e.target.value)}
                  className="w-full text-2xl font-extrabold text-slate-900 border-b border-blue-500 focus:outline-none py-1"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {campaign.headline}
                </h1>
              )}

              {/* Subheadline */}
              {isEditingMode ? (
                <input
                  type="text"
                  value={campaign.subheadline}
                  onChange={(e) => handleSubheadlineChange(e.target.value)}
                  className="w-full text-sm font-medium text-slate-500 border-b border-blue-300 focus:outline-none py-1 mt-2"
                />
              ) : (
                campaign.subheadline && (
                  <p className="text-base font-medium text-slate-500 mt-2 leading-relaxed">
                    {campaign.subheadline}
                  </p>
                )
              )}
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-4">
              {campaign.bodyParagraphs.map((para, idx) => {
                if (isEditingMode) {
                  return (
                    <div key={idx}>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => handleParagraphChange(idx, e.target.value)}
                        className="w-full text-sm text-slate-700 border border-slate-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  );
                }

                if (showHeatmap) {
                  const analysis = analyzeParagraphSentences(para);

                  return (
                    <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50/20 p-3.5 relative my-2 transition shadow-xs">
                      {/* Paragraph Header Stats */}
                      <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500 mb-2 pb-1.5 border-b border-amber-200/80">
                        <div className="flex items-center space-x-2">
                          <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                            Paragraph {idx + 1}
                          </span>
                          <span>{analysis.totalWords} words ({analysis.sentences.length} sentence{analysis.sentences.length > 1 ? 's' : ''})</span>
                        </div>

                        <div>
                          {analysis.complexCount > 0 ? (
                            <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>{analysis.complexCount} complex sentence{analysis.complexCount > 1 ? 's' : ''}</span>
                            </span>
                          ) : analysis.moderateCount > 0 ? (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Moderate Complexity
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ✓ Easy to Read
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sentence-by-sentence highlights */}
                      <div className="text-sm sm:text-base leading-relaxed space-x-1">
                        {analysis.sentences.map((sObj, sIdx) => {
                          let highlightClass = "";
                          if (sObj.level === "complex") {
                            highlightClass = "bg-rose-200/90 text-rose-950 font-medium px-1.5 py-0.5 rounded border-b-2 border-rose-500 hover:bg-rose-300 transition relative group cursor-help";
                          } else if (sObj.level === "moderate") {
                            highlightClass = "bg-amber-200/80 text-amber-950 font-medium px-1.5 py-0.5 rounded border-b-2 border-amber-500 hover:bg-amber-300 transition relative group cursor-help";
                          } else {
                            highlightClass = "bg-emerald-100/70 text-slate-900 px-1 py-0.5 rounded border-b border-emerald-400/50 hover:bg-emerald-200 transition relative group cursor-help";
                          }

                          return (
                            <span key={sIdx} className={`${highlightClass} inline-block my-0.5 me-1`}>
                              {sObj.text}
                              {/* Hover Tooltip */}
                              <span className="absolute left-1/2 -top-1 transform -translate-x-1/2 -translate-y-full hidden group-hover:block z-30 w-60 bg-slate-900 text-slate-100 text-[11px] p-2.5 rounded-xl shadow-2xl border border-slate-700 pointer-events-none font-sans font-normal leading-tight">
                                <span className="font-bold text-amber-400 block mb-0.5">
                                  Sentence #{sIdx + 1} ({sObj.wordCount} words)
                                </span>
                                <span className="text-slate-300">{sObj.reason}</span>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx}>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {para}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Coupon Card */}
            {campaign.promoOffer?.offerCode && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-5 text-center my-6">
                {campaign.promoOffer.badgeText && (
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: campaign.primaryColor }}
                  >
                    {campaign.promoOffer.badgeText}
                  </span>
                )}
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {campaign.promoOffer.offerTitle || "Special Offer"}
                </h4>
                
                <div className="flex items-center justify-center space-x-2 my-2">
                  <div className="bg-white border border-slate-300 font-mono font-bold text-lg text-slate-900 px-4 py-1.5 rounded-lg shadow-sm tracking-widest">
                    {campaign.promoOffer.offerCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                    title="Copy Coupon Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {campaign.promoOffer.expirationNotice && (
                  <p className="text-xs text-slate-500">
                    {campaign.promoOffer.expirationNotice}
                  </p>
                )}
              </div>
            )}

            {/* Key Highlights Grid */}
            {campaign.keyHighlights.length > 0 && (
              <div className="space-y-2.5 my-6">
                {campaign.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3.5 flex items-start space-x-3 border border-slate-100">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs mt-0.5"
                      style={{ backgroundColor: campaign.primaryColor }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        {highlight.title}
                      </h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Primary CTA Button */}
            <div className="text-center pt-2 pb-4">
              {isEditingMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={campaign.primaryCTA.text}
                    onChange={(e) => handleCtaTextChange(e.target.value)}
                    className="text-center font-bold text-sm border border-slate-300 rounded px-4 py-2 w-full focus:outline-none"
                  />
                </div>
              ) : (
                <a
                  href={campaign.primaryCTA.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-bold text-base text-white px-8 py-3.5 rounded-xl shadow-lg transition active:scale-95"
                  style={{ backgroundColor: campaign.primaryColor }}
                >
                  {campaign.primaryCTA.text}
                </a>
              )}

              {campaign.primaryCTA.secondaryNote && (
                <p className="text-xs text-slate-400 mt-2">
                  {campaign.primaryCTA.secondaryNote}
                </p>
              )}
            </div>

            {/* Secondary Section */}
            {campaign.secondarySection?.title && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-bold text-base text-slate-900 mb-1">
                  {campaign.secondarySection.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                  {campaign.secondarySection.description}
                </p>
                {campaign.secondarySection.ctaText && (
                  <a
                    href="#"
                    className="text-xs font-bold underline"
                    style={{ color: campaign.primaryColor }}
                  >
                    {campaign.secondarySection.ctaText} &rarr;
                  </a>
                )}
              </div>
            )}

          </div>

          {/* Email Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-6 text-center text-xs text-slate-500">
            <p className="font-bold text-slate-700 mb-1">
              {campaign.footer.companyName}
            </p>
            <p className="mb-3 text-slate-500">
              {campaign.footer.address}
            </p>
            <p className="text-[11px] text-slate-400">
              You are receiving this email because you subscribed to updates from {campaign.brandName}.
              <br />
              <a href="#" className="underline text-slate-500">Unsubscribe</a> | <a href="#" className="underline text-slate-500">Manage Preferences</a>
            </p>
          </div>

        </div>

      </div>

      {/* Modal for Regenerating Hero Banner Image */}
      {showImagePromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              <span>Regenerate Banner Visual AI Prompt</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Describe the style, subjects, lighting, and composition for the AI visual generator.
            </p>

            <textarea
              rows={4}
              value={customImagePrompt}
              onChange={(e) => setCustomImagePrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-4"
              placeholder="e.g. Minimalist flatlay photography of organic bamboo clothing items on warm neutral linen background, soft golden morning light..."
            />

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowImagePromptModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowImagePromptModal(false);
                  onRegenerateImage(customImagePrompt);
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
