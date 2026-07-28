import React, { useState, useMemo } from "react";
import { EmailCampaign } from "../types";
import {
  Smartphone,
  Monitor,
  Mail,
  Sun,
  Moon,
  Star,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Archive,
  Trash2,
  Tag,
  Search,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Copy,
  Edit3,
  Share2,
  Heart,
  MessageCircle,
  Repeat2,
  ThumbsUp,
  Hash,
  Globe,
  RotateCcw,
  Bookmark,
  Send
} from "lucide-react";

interface InboxSimulationProps {
  campaign: EmailCampaign;
  onUpdateSubjectText?: (idx: number, newText: string) => void;
  onUpdatePreviewText?: (newText: string) => void;
}

type ClientType = "gmail" | "apple" | "outlook" | "social" | "all";
type DeviceType = "mobile" | "desktop";
type ThemeType = "light" | "dark";

export const InboxSimulation: React.FC<InboxSimulationProps> = ({
  campaign,
  onUpdateSubjectText,
  onUpdatePreviewText,
}) => {
  const [activeClient, setActiveClient] = useState<ClientType>("gmail");
  const [deviceMode, setDeviceMode] = useState<DeviceType>("mobile");
  const [inboxTheme, setInboxTheme] = useState<ThemeType>("light");
  const [senderEmail, setSenderEmail] = useState(
    `${campaign.brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}@mailpulse.io`
  );
  const [isStarred, setIsStarred] = useState(false);
  const [isUnread, setIsUnread] = useState(true);
  const [copiedSubject, setCopiedSubject] = useState(false);

  // Social Media Post Generator State
  const [socialPlatform, setSocialPlatform] = useState<"linkedin" | "twitter" | "instagram">("linkedin");
  const [customSocialCaption, setCustomSocialCaption] = useState<string>("");
  const [copiedSocialNotice, setCopiedSocialNotice] = useState<string | null>(null);

  const defaultHashtags = useMemo(() => {
    const brandTag = `#${campaign.brandName.replace(/[^a-zA-Z0-9]/g, "") || "Brand"}`;
    const tags = [brandTag, "#SpecialOffer", "#ExclusiveDeal", "#EmailMarketing", "#LimitedTime"];
    if (campaign.couponCode) tags.push("#DiscountCode");
    return tags;
  }, [campaign.brandName, campaign.couponCode]);

  const [activeHashtags, setActiveHashtags] = useState<string[]>(defaultHashtags);

  const generatedCaption = useMemo(() => {
    const headline = campaign.headline || "Special Announcement";
    const bodyFirst = campaign.bodyParagraphs[0] || "";
    const promo = campaign.couponCode ? `\n\n🎟️ Use promo code ${campaign.couponCode} for an exclusive discount!` : "";
    const cta = campaign.callToActionText ? `\n\n👉 ${campaign.callToActionText}: ${campaign.callToActionUrl || "https://brand.com/offer"}` : "";
    const tagsStr = activeHashtags.length > 0 ? `\n\n${activeHashtags.join(" ")}` : "";

    return `${headline}\n\n${bodyFirst}${promo}${cta}${tagsStr}`;
  }, [campaign, activeHashtags]);

  const currentCaption = customSocialCaption || generatedCaption;

  const handleResetCaption = () => {
    setCustomSocialCaption("");
  };

  const handleToggleHashtag = (tag: string) => {
    if (activeHashtags.includes(tag)) {
      setActiveHashtags(activeHashtags.filter((t) => t !== tag));
    } else {
      setActiveHashtags([...activeHashtags, tag]);
    }
  };

  const handleCopySocialCaption = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSocialNotice(label);
    setTimeout(() => setCopiedSocialNotice(null), 2000);
  };

  const activeSubject =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text ||
    campaign.subjectLines[0]?.text ||
    "Special Announcement";

  const previewText = campaign.previewText || "Open to discover our latest offers and updates.";

  const brandInitial = (campaign.brandName || "B").charAt(0).toUpperCase();
  const primaryColor = campaign.primaryColor || "#3b82f6";

  // Length Analysis
  const subjectLen = activeSubject.length;
  const previewLen = previewText.length;

  const handleCopySubject = () => {
    navigator.clipboard.writeText(activeSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  // Render individual client row/item
  const renderGmailView = (isMobile: boolean, isDark: boolean) => {
    const bgClass = isDark ? "bg-[#1f1f1f] text-slate-100 border-zinc-800" : "bg-white text-slate-900 border-gray-200";
    const subTextClass = isDark ? "text-zinc-400" : "text-gray-500";
    const hoverBg = isDark ? "hover:bg-zinc-800/60" : "hover:bg-gray-50";

    if (isMobile) {
      return (
        <div className={`p-3.5 border-b transition ${bgClass} ${hoverBg}`}>
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {brandInitial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm truncate ${isUnread ? "font-bold text-white" : "font-semibold"}`}>
                  {campaign.brandName}
                </span>
                <span className={`text-[11px] shrink-0 ml-2 ${isUnread ? "font-bold text-blue-400" : subTextClass}`}>
                  9:41 AM
                </span>
              </div>

              <div className={`text-xs truncate ${isUnread ? "font-bold text-slate-100" : "font-medium text-slate-300"}`}>
                {activeSubject}
              </div>

              <div className={`text-[11px] truncate mt-0.5 ${subTextClass}`}>
                {previewText}
              </div>
            </div>

            <button
              onClick={() => setIsStarred(!isStarred)}
              className="pt-1 text-slate-400 hover:text-amber-400 shrink-0"
            >
              <Star className={`w-4 h-4 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </div>
        </div>
      );
    }

    // Gmail Desktop
    return (
      <div className={`px-4 py-3 border-b flex items-center space-x-3 transition ${bgClass} ${hoverBg} text-xs`}>
        <div className="flex items-center space-x-2 shrink-0">
          <input type="checkbox" className="rounded border-gray-400 text-blue-600 focus:ring-0 cursor-pointer" />
          <button onClick={() => setIsStarred(!isStarred)} className="text-slate-400 hover:text-amber-400">
            <Star className={`w-4 h-4 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>

        <div className="w-44 shrink-0 truncate">
          <span className={`${isUnread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>
            {campaign.brandName}
          </span>
        </div>

        <div className="flex-1 min-w-0 truncate">
          <span className={`${isUnread ? "font-bold text-slate-900 dark:text-white" : "font-normal text-slate-800 dark:text-slate-200"}`}>
            {activeSubject}
          </span>
          <span className={`mx-1.5 ${subTextClass}`}>-</span>
          <span className={subTextClass}>{previewText}</span>
        </div>

        <div className={`shrink-0 text-right ${isUnread ? "font-bold text-blue-600 dark:text-blue-400" : subTextClass}`}>
          10:24 AM
        </div>
      </div>
    );
  };

  const renderAppleMailView = (isMobile: boolean, isDark: boolean) => {
    const bgClass = isDark ? "bg-[#1c1c1e] text-white border-zinc-800" : "bg-white text-slate-900 border-slate-200";
    const subTextClass = isDark ? "text-zinc-400" : "text-slate-500";
    const hoverBg = isDark ? "hover:bg-zinc-800/70" : "hover:bg-slate-100/70";

    if (isMobile) {
      return (
        <div className={`p-3.5 border-b transition ${bgClass} ${hoverBg}`}>
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center space-x-2 min-w-0">
              {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />}
              <span className={`text-sm truncate ${isUnread ? "font-bold text-white" : "font-semibold"}`}>
                {campaign.brandName}
              </span>
            </div>
            <span className={`text-xs shrink-0 ml-2 ${subTextClass}`}>9:41 AM</span>
          </div>

          <div className={`text-xs mb-1 truncate ${isUnread ? "font-semibold text-slate-100" : "font-medium text-slate-300"}`}>
            {activeSubject}
          </div>

          <p className={`text-[11px] line-clamp-2 leading-relaxed ${subTextClass}`}>
            {previewText}
          </p>
        </div>
      );
    }

    // Apple Mail macOS Desktop
    return (
      <div className={`p-3.5 border-b border-l-4 ${isUnread ? "border-l-blue-500" : "border-l-transparent"} transition ${bgClass} ${hoverBg}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{campaign.brandName}</span>
          <span className={`text-[11px] ${subTextClass}`}>Yesterday</span>
        </div>

        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mb-0.5">
          {activeSubject}
        </div>

        <div className={`text-[11px] line-clamp-1 ${subTextClass}`}>
          {previewText}
        </div>
      </div>
    );
  };

  const renderOutlookView = (isMobile: boolean, isDark: boolean) => {
    const bgClass = isDark ? "bg-[#111827] text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-200";
    const subTextClass = isDark ? "text-slate-400" : "text-slate-500";
    const hoverBg = isDark ? "hover:bg-slate-800/60" : "hover:bg-blue-50/50";

    if (isMobile) {
      return (
        <div className={`p-3.5 border-b transition ${bgClass} ${hoverBg}`}>
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {brandInitial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs truncate ${isUnread ? "font-bold text-white" : "font-semibold"}`}>
                  {campaign.brandName}
                </span>
                <span className={`text-[10px] ${subTextClass}`}>8:15 AM</span>
              </div>

              <div className={`text-xs truncate ${isUnread ? "font-bold text-blue-400" : "font-medium"}`}>
                {activeSubject}
              </div>

              <div className={`text-[11px] truncate mt-0.5 ${subTextClass}`}>
                {previewText}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Outlook Desktop
    return (
      <div className={`p-3 border-b flex items-center space-x-3 transition ${bgClass} ${hoverBg} text-xs`}>
        <div className={`w-1 h-8 rounded ${isUnread ? "bg-blue-600" : "bg-transparent"}`} />

        <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
          {brandInitial}
        </div>

        <div className="w-40 shrink-0 truncate">
          <div className="font-bold text-slate-900 dark:text-white">{campaign.brandName}</div>
          <div className="text-[10px] text-slate-400 truncate">{senderEmail}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{activeSubject}</div>
          <div className={`text-[11px] truncate ${subTextClass}`}>{previewText}</div>
        </div>

        <div className="text-[10px] text-slate-400 shrink-0 text-right">
          <div>Wed 10:14</div>
          <div className="text-blue-500 font-semibold mt-0.5">Focused</div>
        </div>
      </div>
    );
  };

  const renderSocialMediaView = () => {
    const isDark = inboxTheme === "dark";
    const bgCard = isDark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-lg";
    const handleName = `@${campaign.brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}`;

    const platformLimits = {
      linkedin: 3000,
      twitter: 280,
      instagram: 2200,
    };
    const currentLimit = platformLimits[socialPlatform];
    const captionLength = currentCaption.length;
    const isOverLimit = captionLength > currentLimit;

    return (
      <div className="space-y-6">
        {/* Social View Sub-Header */}
        <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-bold text-white">Cross-Channel Social Media Post Generator</h4>
                <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  Auto-Formatted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Preview and adapt your email content into engaging posts for LinkedIn, X (Twitter), and Instagram
              </p>
            </div>
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setSocialPlatform("linkedin")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                socialPlatform === "linkedin"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>💼 LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => setSocialPlatform("twitter")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                socialPlatform === "twitter"
                  ? "bg-sky-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🐦 X / Twitter</span>
            </button>

            <button
              type="button"
              onClick={() => setSocialPlatform("instagram")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                socialPlatform === "instagram"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📸 Instagram</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Controls & Editor Left / Live Feed Mockup Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Post Customizer & Hashtags */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Post Caption Editor Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Social Post Caption Draft</span>
                </label>
                {customSocialCaption && (
                  <button
                    type="button"
                    onClick={handleResetCaption}
                    className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Auto</span>
                  </button>
                )}
              </div>

              <textarea
                rows={7}
                value={currentCaption}
                onChange={(e) => setCustomSocialCaption(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                placeholder="Customize your social post caption..."
              />

              {/* Character Limit Meter */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className={isOverLimit ? "text-rose-400 font-bold" : "text-slate-400"}>
                    {captionLength} / {currentLimit} chars
                  </span>
                  {isOverLimit && (
                    <span className="text-rose-400 text-[10px] font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      ⚠ Exceeds {socialPlatform === "twitter" ? "X / Twitter 280" : "Platform"} Limit
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOverLimit ? "bg-rose-500" : captionLength > currentLimit * 0.8 ? "bg-amber-400" : "bg-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, (captionLength / currentLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hashtag Suggestions Selector */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hashtag Preset Chips</span>
                </span>
                <span className="text-[10px] text-slate-500">Toggle to include</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {defaultHashtags.map((tag) => {
                  const isActive = activeHashtags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleHashtag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1 ${
                        isActive
                          ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                          : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      <span>{tag}</span>
                      {isActive && <Check className="w-3 h-3 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleCopySocialCaption(currentCaption, "Copied Post Caption!")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                {copiedSocialNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>{copiedSocialNotice}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Social Post Draft</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Live Feed Mockup Display */}
          <div className="lg:col-span-7 flex flex-col items-center justify-start">
            
            <div className="w-full max-w-lg">
              
              {/* LINKEDIN MOCKUP CARD */}
              {socialPlatform === "linkedin" && (
                <div className={`rounded-2xl border ${bgCard} overflow-hidden shadow-2xl transition`}>
                  {/* LinkedIn Post Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base shadow shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {brandInitial}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-sm leading-snug">{campaign.brandName}</span>
                          <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.2 rounded font-semibold">1st</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          Official Account • {campaign.subjectLines[0]?.text || "Company News"}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <span>2h • Promoted •</span>
                          <Globe className="w-2.5 h-2.5 inline" />
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-200 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* LinkedIn Caption Text */}
                  <div className="p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {currentCaption}
                  </div>

                  {/* LinkedIn Rich Link / Hero Image Card */}
                  <div className="border-t border-b border-slate-200 dark:border-slate-800/80 bg-slate-900/50">
                    {campaign.heroImageUrl ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                        <img
                          src={campaign.heroImageUrl}
                          alt="Campaign Banner"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}22 0%, #0f172a 100%)` }}
                      >
                        <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
                        <h5 className="font-bold text-white text-sm">{campaign.headline}</h5>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">{campaign.previewText}</p>
                      </div>
                    )}

                    <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block truncate">
                          {campaign.callToActionUrl || "mailpulse.io/exclusive-deal"}
                        </span>
                        <span className="font-bold text-xs text-white block truncate">{campaign.headline}</span>
                      </div>
                      <span className="bg-indigo-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shrink-0 shadow">
                        {campaign.callToActionText || "Learn More"}
                      </span>
                    </div>
                  </div>

                  {/* LinkedIn Reactions & Metrics */}
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</span>
                      <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white">👏</span>
                      <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[8px] text-white">❤️</span>
                      <span className="ml-1 font-semibold text-slate-300">184 reactions</span>
                    </div>
                    <span>32 comments • 14 reposts</span>
                  </div>

                  {/* LinkedIn Interactive Buttons */}
                  <div className="p-2 grid grid-cols-4 gap-1 text-[11px] font-semibold text-slate-400 text-center">
                    <button className="py-2 hover:bg-slate-800/50 rounded-lg transition flex items-center justify-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </button>
                    <button className="py-2 hover:bg-slate-800/50 rounded-lg transition flex items-center justify-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </button>
                    <button className="py-2 hover:bg-slate-800/50 rounded-lg transition flex items-center justify-center space-x-1">
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>Repost</span>
                    </button>
                    <button className="py-2 hover:bg-slate-800/50 rounded-lg transition flex items-center justify-center space-x-1">
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TWITTER / X MOCKUP CARD */}
              {socialPlatform === "twitter" && (
                <div className={`rounded-2xl border ${bgCard} p-4 shadow-2xl space-y-3 transition`}>
                  {/* Tweet Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {brandInitial}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-sm leading-tight text-white">{campaign.brandName}</span>
                          <span className="text-sky-400 text-xs">✓</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{handleName}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">2h</span>
                  </div>

                  {/* Tweet Text */}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-100">
                    {currentCaption}
                  </p>

                  {/* Tweet Media Banner */}
                  <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
                    {campaign.heroImageUrl ? (
                      <img
                        src={campaign.heroImageUrl}
                        alt="Tweet Media"
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="h-36 w-full flex flex-col items-center justify-center p-4 text-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}33 0%, #1e293b 100%)` }}
                      >
                        <Sparkles className="w-6 h-6 text-sky-400 mb-1" />
                        <span className="font-bold text-xs text-white">{campaign.headline}</span>
                      </div>
                    )}
                    <div className="p-2.5 bg-slate-950/90 text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px] block">mailpulse.io</span>
                      <span className="font-bold text-white block truncate">{campaign.headline}</span>
                    </div>
                  </div>

                  {/* Tweet Action Bar */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400 px-2">
                    <span className="flex items-center space-x-1.5 hover:text-sky-400 cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px]">28</span>
                    </span>
                    <span className="flex items-center space-x-1.5 hover:text-emerald-400 cursor-pointer">
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">94</span>
                    </span>
                    <span className="flex items-center space-x-1.5 hover:text-rose-400 cursor-pointer">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[11px]">412</span>
                    </span>
                    <span className="flex items-center space-x-1.5 hover:text-sky-400 cursor-pointer">
                      <Bookmark className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* INSTAGRAM MOCKUP CARD */}
              {socialPlatform === "instagram" && (
                <div className={`rounded-2xl border ${bgCard} overflow-hidden shadow-2xl transition`}>
                  {/* Instagram Header */}
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ring-2 ring-pink-500/80 p-0.5 shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {brandInitial}
                      </div>
                      <span className="font-bold text-xs text-white">{campaign.brandName.toLowerCase().replace(/\s+/g, "")}</span>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Instagram Post Media */}
                  <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    {campaign.heroImageUrl ? (
                      <img
                        src={campaign.heroImageUrl}
                        alt="Instagram Post"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="w-full h-full p-6 flex flex-col items-center justify-center text-center"
                        style={{ background: `linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)` }}
                      >
                        <Sparkles className="w-10 h-10 text-white mb-2" />
                        <h4 className="font-bold text-white text-lg drop-shadow">{campaign.headline}</h4>
                        {campaign.couponCode && (
                          <div className="mt-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-mono font-bold text-xs border border-white/30">
                            CODE: {campaign.couponCode}
                          </div>
                        )}
                      </div>
                    )}
                    {campaign.couponCode && (
                      <div className="absolute top-3 right-3 bg-slate-950/90 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 shadow">
                        🏷️ {campaign.couponCode}
                      </div>
                    )}
                  </div>

                  {/* Instagram Action Icons */}
                  <div className="p-3 flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <MessageCircle className="w-5 h-5 text-slate-300" />
                      <Send className="w-5 h-5 text-slate-300" />
                    </div>
                    <Bookmark className="w-5 h-5 text-slate-300" />
                  </div>

                  {/* Likes Count & Caption */}
                  <div className="px-3 pb-3 space-y-1 text-xs">
                    <div className="font-bold text-white text-[11px]">Liked by alex_m and 629 others</div>
                    <div className="text-slate-300 leading-normal text-[11px]">
                      <strong className="text-white mr-1.5">{campaign.brandName.toLowerCase().replace(/\s+/g, "")}</strong>
                      {currentCaption}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div id="inbox-simulation-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 text-slate-100 shadow-2xl mb-8">
      
      {/* Component Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Multi-Client Inbox Simulator</span>
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              Real-Time Viewport Test
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Inbox Appearance & Truncation Tester
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Preview exactly how your email's subject line and preview text render across Gmail, Apple Mail, and Outlook on mobile and desktop viewports.
          </p>
        </div>

        {/* Global Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          {/* Device Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                deviceMode === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                deviceMode === "desktop"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setInboxTheme(inboxTheme === "light" ? "dark" : "light")}
            className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Toggle Light / Dark Mode Inbox background"
          >
            {inboxTheme === "light" ? (
              <>
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Dark Inbox</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Light Inbox</span>
              </>
            )}
          </button>

          {/* Quick Copy Subject */}
          <button
            onClick={handleCopySubject}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            {copiedSubject ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Subject</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Truncation & Optimization Health Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        
        {/* Subject Line Analytics */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <span>Subject Line Length</span>
              <span className="text-[10px] text-slate-500 font-mono">({subjectLen} chars)</span>
            </span>
            {subjectLen <= 50 ? (
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
                ✓ No Mobile Truncation
              </span>
            ) : subjectLen <= 65 ? (
              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/20">
                ⚠ May Cut-off on iPhone
              </span>
            ) : (
              <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/20">
                ❌ High Truncation Risk (&gt;65 chars)
              </span>
            )}
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                subjectLen <= 50 ? "bg-emerald-500" : subjectLen <= 65 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (subjectLen / 80) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
            <span>0</span>
            <span>35 (Mobile Limit)</span>
            <span>60 (Desktop Limit)</span>
            <span>80+</span>
          </div>
        </div>

        {/* Preheader / Preview Text Analytics */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5">
              <span>Preview Text Length</span>
              <span className="text-[10px] text-slate-500 font-mono">({previewLen} chars)</span>
            </span>
            {previewLen >= 30 && previewLen <= 90 ? (
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
                ✓ Optimal Preheader
              </span>
            ) : previewLen < 30 ? (
              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/20">
                ⚠ Short (Client Body Will Bleed In)
              </span>
            ) : (
              <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-500/20">
                ℹ Long Preheader
              </span>
            )}
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (previewLen / 120) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
            <span>0</span>
            <span>30 (Min Rec)</span>
            <span>90 (Max Mobile)</span>
            <span>120+</span>
          </div>
        </div>

      </div>

      {/* Client Selector Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveClient("gmail")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeClient === "gmail"
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span>Google Gmail</span>
        </button>

        <button
          onClick={() => setActiveClient("apple")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeClient === "apple"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
          <span>Apple Mail (iOS & Mac)</span>
        </button>

        <button
          onClick={() => setActiveClient("outlook")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeClient === "outlook"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          <span>Microsoft Outlook</span>
        </button>

        <button
          onClick={() => setActiveClient("social")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeClient === "social"
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Social Media Post Preview</span>
        </button>

        <button
          onClick={() => setActiveClient("all")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeClient === "all"
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Compare All Clients</span>
        </button>
      </div>

      {/* Main Simulation View Area */}
      {activeClient === "social" ? (
        renderSocialMediaView()
      ) : activeClient !== "all" ? (
        <div className="flex flex-col items-center">
          
          {deviceMode === "mobile" ? (
            /* Realistic Mobile Device Mockup Frame */
            <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-[36px] overflow-hidden shadow-2xl p-2 relative my-2">
              
              {/* iPhone Notch Header Bar */}
              <div className="bg-slate-950 pt-2 pb-1.5 px-6 flex items-center justify-between text-[11px] text-slate-400 font-semibold select-none border-b border-slate-900">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto my-0" />
                <div className="flex items-center space-x-1">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5">
                    <div className="w-full h-full bg-slate-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Client App Search/Header Bar */}
              <div className={`p-3 border-b flex items-center justify-between text-xs ${
                inboxTheme === "dark" ? "bg-zinc-900 text-white border-zinc-800" : "bg-gray-100 text-gray-800 border-gray-200"
              }`}>
                <div className="flex items-center space-x-2">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold capitalize">{activeClient} Inbox</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </div>

              {/* Render Selected Client Inbox List Item */}
              <div className="min-h-[140px] bg-slate-950">
                {activeClient === "gmail" && renderGmailView(true, inboxTheme === "dark")}
                {activeClient === "apple" && renderAppleMailView(true, inboxTheme === "dark")}
                {activeClient === "outlook" && renderOutlookView(true, inboxTheme === "dark")}
              </div>

              {/* Simulated iPhone Home Indicator */}
              <div className="bg-slate-950 py-2 flex justify-center">
                <div className="w-28 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          ) : (
            /* Desktop Viewport Container */
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              
              {/* Desktop Browser / App Window Titlebar */}
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2 capitalize">
                    {activeClient} Client (Desktop View)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">100% Zoom</span>
                </div>
              </div>

              {/* Desktop Row List */}
              <div className="divide-y divide-slate-800">
                {activeClient === "gmail" && renderGmailView(false, inboxTheme === "dark")}
                {activeClient === "apple" && renderAppleMailView(false, inboxTheme === "dark")}
                {activeClient === "outlook" && renderOutlookView(false, inboxTheme === "dark")}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Matrix Grid: Side-by-Side Comparison of All Clients */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Gmail Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-red-500/10 border-b border-red-500/20 px-3.5 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-red-400">Google Gmail</span>
              <span className="text-[10px] text-slate-400">Mobile & Desktop</span>
            </div>
            {renderGmailView(true, inboxTheme === "dark")}
          </div>

          {/* Apple Mail Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-3.5 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">Apple Mail (iOS)</span>
              <span className="text-[10px] text-slate-400">iOS Standard</span>
            </div>
            {renderAppleMailView(true, inboxTheme === "dark")}
          </div>

          {/* Outlook Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-3.5 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">Microsoft Outlook</span>
              <span className="text-[10px] text-slate-400">Focused Inbox</span>
            </div>
            {renderOutlookView(true, inboxTheme === "dark")}
          </div>

        </div>
      )}

      {/* Recommendations & Best Practices Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Keep subject lines under 45 characters to avoid mobile truncation on iOS & Android devices.
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Tested on iPhone 15 Pro, Mac Mail & Outlook 365
        </div>
      </div>

    </div>
  );
};
