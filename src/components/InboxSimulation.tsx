import React, { useState } from "react";
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
  Edit3
} from "lucide-react";

interface InboxSimulationProps {
  campaign: EmailCampaign;
  onUpdateSubjectText?: (idx: number, newText: string) => void;
  onUpdatePreviewText?: (newText: string) => void;
}

type ClientType = "gmail" | "apple" | "outlook" | "all";
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
      {activeClient !== "all" ? (
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
