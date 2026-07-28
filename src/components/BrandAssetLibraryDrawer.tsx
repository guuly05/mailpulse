import React, { useState, useEffect } from "react";
import {
  BrandAssetLibraryData,
  BrandColorAsset,
  BrandVoiceGuideline,
  BrandBoilerplateSignature,
  EmailCampaign,
} from "../types";
import {
  X,
  Palette,
  Volume2,
  FileSignature,
  Plus,
  Trash2,
  Copy,
  Check,
  Edit3,
  Bookmark,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

const BRAND_ASSETS_STORAGE_KEY = "mailpulse_brand_asset_library_v1";

const DEFAULT_BRAND_ASSETS: BrandAssetLibraryData = {
  colors: [
    { id: "c1", label: "Primary Brand Blue", hex: "#2563eb" },
    { id: "c2", label: "Secondary Indigo", hex: "#4f46e5" },
    { id: "c3", label: "Accent Amber / Promo Gold", hex: "#f59e0b" },
    { id: "c4", label: "Dark Neutral Text", hex: "#1e293b" },
    { id: "c5", label: "Light Slate Canvas", hex: "#f8fafc" },
    { id: "c6", label: "Success Emerald", hex: "#10b981" },
  ],
  voiceGuidelines: [
    {
      id: "v1",
      title: "Core Brand Voice & Persona",
      tone: "Warm, Friendly, Direct & Authoritative",
      targetAudience: "Tech Decision Makers & Modern Entrepreneurs",
      keyPhrases: [
        "Streamline your workflow",
        "Built for high-performing teams",
        "Simple, fast, and secure",
      ],
      bannedWords: ["Cheap", "Game-changer", "Synergy", "Guarantee"],
      notes: "Keep sentences under 20 words. Focus on outcome-driven benefits rather than technical specs.",
    },
  ],
  signatures: [
    {
      id: "s1",
      title: "Standard Corporate Email Footer",
      senderName: "The MailPulse Marketing Team",
      companyName: "MailPulse AI Technologies Inc.",
      address: "500 Howard Street, Suite 300, San Francisco, CA 94105",
      unsubscribeText: "You are receiving this email because you opted into MailPulse product news. Click here to manage your preferences or unsubscribe.",
      legalDisclaimer: "© 2026 MailPulse AI Inc. All rights reserved. Confidential & Proprietary.",
    },
  ],
};

interface BrandAssetLibraryDrawerProps {
  onClose: () => void;
  activeCampaign?: EmailCampaign | null;
  onUpdateCampaign?: (updated: EmailCampaign) => void;
}

export const BrandAssetLibraryDrawer: React.FC<BrandAssetLibraryDrawerProps> = ({
  onClose,
  activeCampaign,
  onUpdateCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<"colors" | "voice" | "signatures">("colors");
  const [libraryData, setLibraryData] = useState<BrandAssetLibraryData>(DEFAULT_BRAND_ASSETS);

  // Notice banners
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Forms for adding assets
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorLabel, setNewColorLabel] = useState("");
  const [newColorHex, setNewColorHex] = useState("#3b82f6");

  const [showAddVoice, setShowAddVoice] = useState(false);
  const [newVoiceTitle, setNewVoiceTitle] = useState("");
  const [newVoiceTone, setNewVoiceTone] = useState("");
  const [newVoiceAudience, setNewVoiceAudience] = useState("");
  const [newVoicePhrases, setNewVoicePhrases] = useState("");
  const [newVoiceBanned, setNewVoiceBanned] = useState("");
  const [newVoiceNotes, setNewVoiceNotes] = useState("");

  const [showAddSignature, setShowAddSignature] = useState(false);
  const [newSigTitle, setNewSigTitle] = useState("");
  const [newSigSender, setNewSigSender] = useState("");
  const [newSigCompany, setNewSigCompany] = useState("");
  const [newSigAddress, setNewSigAddress] = useState("");
  const [newSigUnsubscribe, setNewSigUnsubscribe] = useState("");
  const [newSigDisclaimer, setNewSigDisclaimer] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAND_ASSETS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setLibraryData({
            colors: parsed.colors || DEFAULT_BRAND_ASSETS.colors,
            voiceGuidelines: parsed.voiceGuidelines || DEFAULT_BRAND_ASSETS.voiceGuidelines,
            signatures: parsed.signatures || DEFAULT_BRAND_ASSETS.signatures,
          });
        }
      }
    } catch (e) {
      console.error("Failed to load brand assets from storage", e);
    }
  }, []);

  // Save helper
  const saveLibrary = (data: BrandAssetLibraryData) => {
    setLibraryData(data);
    try {
      localStorage.setItem(BRAND_ASSETS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save brand assets", e);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset Brand Asset Library back to default templates?")) {
      saveLibrary(DEFAULT_BRAND_ASSETS);
      triggerNotice("Library reset to default template.");
    }
  };

  const triggerNotice = (msg: string) => {
    setAppliedNotice(msg);
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Color actions
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorLabel.trim()) return;
    const newColor: BrandColorAsset = {
      id: "c_" + Date.now(),
      label: newColorLabel.trim(),
      hex: newColorHex,
    };
    const updated = {
      ...libraryData,
      colors: [...libraryData.colors, newColor],
    };
    saveLibrary(updated);
    setNewColorLabel("");
    setShowAddColor(false);
    triggerNotice(`Added color "${newColor.label}"`);
  };

  const handleDeleteColor = (id: string) => {
    const updated = {
      ...libraryData,
      colors: libraryData.colors.filter((c) => c.id !== id),
    };
    saveLibrary(updated);
  };

  const handleApplyColorToCampaign = (hex: string, targetProp: "primaryColor" | "backgroundColor" | "textColor") => {
    if (!activeCampaign || !onUpdateCampaign) {
      triggerCopy(`hex_${hex}`, hex);
      triggerNotice(`Copied hex ${hex}`);
      return;
    }
    const updated: EmailCampaign = {
      ...activeCampaign,
      [targetProp]: hex,
    };
    onUpdateCampaign(updated);
    triggerNotice(`Applied ${hex} to Campaign ${targetProp === "primaryColor" ? "Primary" : targetProp === "backgroundColor" ? "Background" : "Text"}`);
  };

  // Voice actions
  const handleAddVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoiceTitle.trim() || !newVoiceTone.trim()) return;
    const newVoice: BrandVoiceGuideline = {
      id: "v_" + Date.now(),
      title: newVoiceTitle.trim(),
      tone: newVoiceTone.trim(),
      targetAudience: newVoiceAudience.trim() || undefined,
      keyPhrases: newVoicePhrases ? newVoicePhrases.split(",").map((p) => p.trim()).filter(Boolean) : undefined,
      bannedWords: newVoiceBanned ? newVoiceBanned.split(",").map((w) => w.trim()).filter(Boolean) : undefined,
      notes: newVoiceNotes.trim() || undefined,
    };
    const updated = {
      ...libraryData,
      voiceGuidelines: [...libraryData.voiceGuidelines, newVoice],
    };
    saveLibrary(updated);
    setNewVoiceTitle("");
    setNewVoiceTone("");
    setNewVoiceAudience("");
    setNewVoicePhrases("");
    setNewVoiceBanned("");
    setNewVoiceNotes("");
    setShowAddVoice(false);
    triggerNotice(`Added voice guideline "${newVoice.title}"`);
  };

  const handleDeleteVoice = (id: string) => {
    const updated = {
      ...libraryData,
      voiceGuidelines: libraryData.voiceGuidelines.filter((v) => v.id !== id),
    };
    saveLibrary(updated);
  };

  const handleApplyVoiceToCampaign = (voice: BrandVoiceGuideline) => {
    if (!activeCampaign || !onUpdateCampaign) {
      triggerCopy(voice.id, `${voice.title}: ${voice.tone}`);
      triggerNotice("Copied Voice Guideline summary");
      return;
    }
    const updated: EmailCampaign = {
      ...activeCampaign,
      brandTone: voice.tone,
    };
    onUpdateCampaign(updated);
    triggerNotice(`Applied tone "${voice.tone}" to active campaign!`);
  };

  // Signature actions
  const handleAddSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSigTitle.trim() || !newSigCompany.trim()) return;
    const newSig: BrandBoilerplateSignature = {
      id: "s_" + Date.now(),
      title: newSigTitle.trim(),
      senderName: newSigSender.trim() || "Marketing Team",
      companyName: newSigCompany.trim(),
      address: newSigAddress.trim() || "San Francisco, CA",
      unsubscribeText: newSigUnsubscribe.trim() || "Unsubscribe here.",
      legalDisclaimer: newSigDisclaimer.trim() || undefined,
    };
    const updated = {
      ...libraryData,
      signatures: [...libraryData.signatures, newSig],
    };
    saveLibrary(updated);
    setNewSigTitle("");
    setNewSigSender("");
    setNewSigCompany("");
    setNewSigAddress("");
    setNewSigUnsubscribe("");
    setNewSigDisclaimer("");
    setShowAddSignature(false);
    triggerNotice(`Added signature "${newSig.title}"`);
  };

  const handleDeleteSignature = (id: string) => {
    const updated = {
      ...libraryData,
      signatures: libraryData.signatures.filter((s) => s.id !== id),
    };
    saveLibrary(updated);
  };

  const handleApplySignatureToCampaign = (sig: BrandBoilerplateSignature) => {
    if (!activeCampaign || !onUpdateCampaign) {
      triggerCopy(sig.id, `${sig.companyName}\n${sig.address}\n${sig.unsubscribeText}`);
      triggerNotice("Copied signature text to clipboard!");
      return;
    }
    const updated: EmailCampaign = {
      ...activeCampaign,
      brandName: sig.companyName || activeCampaign.brandName,
      footer: {
        companyName: sig.companyName,
        address: sig.address,
        unsubscribeText: sig.unsubscribeText,
      },
    };
    onUpdateCampaign(updated);
    triggerNotice(`Applied "${sig.title}" signature to Campaign footer & brand info!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 max-w-lg w-full h-full p-5 sm:p-6 text-slate-100 shadow-2xl flex flex-col transition-all animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shadow-md">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Brand Asset Library</h3>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono px-2 py-0.2 rounded-full">
                  Persistent Storage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Store hex codes, brand voice rules & company signatures
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleResetDefaults}
              title="Reset default assets"
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notice Banner */}
        {appliedNotice && (
          <div className="mt-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 my-4 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("colors")}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === "colors"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Hex Colors</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {libraryData.colors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("voice")}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === "voice"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Brand Voice</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {libraryData.voiceGuidelines.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("signatures")}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              activeTab === "signatures"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Signatures</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {libraryData.signatures.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">

          {/* TAB 1: HEX COLORS */}
          {activeTab === "colors" && (
            <div className="space-y-4 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-semibold">
                  Saved Palette Swatches ({libraryData.colors.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddColor(!showAddColor)}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Color</span>
                </button>
              </div>

              {/* Add Color Form Drawer */}
              {showAddColor && (
                <form onSubmit={handleAddColor} className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30 space-y-3">
                  <h4 className="font-bold text-white text-xs">Add New Hex Color</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Color Name / Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Primary Brand Teal"
                        value={newColorLabel}
                        onChange={(e) => setNewColorLabel(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Hex Code</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-slate-900 p-0.5"
                        />
                        <input
                          type="text"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddColor(false)}
                      className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg shadow"
                    >
                      Save Color Swatch
                    </button>
                  </div>
                </form>
              )}

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {libraryData.colors.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl border border-slate-700 shadow-inner shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white text-xs block truncate">{c.label}</span>
                        <span className="font-mono text-[11px] text-slate-400">{c.hex}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {/* Copy Hex */}
                      <button
                        type="button"
                        onClick={() => triggerCopy(c.id, c.hex)}
                        title="Copy Hex Code"
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                      >
                        {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Apply to Campaign Primary */}
                      <button
                        type="button"
                        onClick={() => handleApplyColorToCampaign(c.hex, "primaryColor")}
                        title="Apply as Campaign Primary Color"
                        className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold transition"
                      >
                        Set Primary
                      </button>

                      {/* Apply to Campaign BG */}
                      <button
                        type="button"
                        onClick={() => handleApplyColorToCampaign(c.hex, "backgroundColor")}
                        title="Apply as Campaign Background Color"
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-bold transition"
                      >
                        Set BG
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteColor(c.id)}
                        title="Delete swatch"
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: BRAND VOICE GUIDELINES */}
          {activeTab === "voice" && (
            <div className="space-y-4 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-semibold">
                  Saved Brand Guidelines ({libraryData.voiceGuidelines.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddVoice(!showAddVoice)}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guideline</span>
                </button>
              </div>

              {/* Add Voice Form Drawer */}
              {showAddVoice && (
                <form onSubmit={handleAddVoice} className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30 space-y-3">
                  <h4 className="font-bold text-white text-xs">Add Brand Voice Guideline</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Guideline Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Executive Corporate Persona"
                        value={newVoiceTitle}
                        onChange={(e) => setNewVoiceTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Tone & Voice Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Warm, Empathetic, Concise & Direct"
                        value={newVoiceTone}
                        onChange={(e) => setNewVoiceTone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. CTOs, VP of Marketing, SMB Owners"
                        value={newVoiceAudience}
                        onChange={(e) => setNewVoiceAudience(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Key Phrases (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Built for teams, Fast setup"
                          value={newVoicePhrases}
                          onChange={(e) => setNewVoicePhrases(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Banned Words (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Cheap, Synergy, Guarantee"
                          value={newVoiceBanned}
                          onChange={(e) => setNewVoiceBanned(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Specific Copywriting Notes</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Avoid hype words. Always keep paragraphs under 3 sentences."
                        value={newVoiceNotes}
                        onChange={(e) => setNewVoiceNotes(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddVoice(false)}
                      className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg shadow"
                    >
                      Save Voice Guideline
                    </button>
                  </div>
                </form>
              )}

              {/* Voice Cards */}
              <div className="space-y-3">
                {libraryData.voiceGuidelines.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white text-sm block">{v.title}</span>
                        <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                          🎭 {v.tone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVoice(v.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {v.targetAudience && (
                      <div className="text-[11px] text-slate-400">
                        <strong>Target Audience:</strong> {v.targetAudience}
                      </div>
                    )}

                    {v.keyPhrases && v.keyPhrases.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Recommended Key Phrases:</span>
                        <div className="flex flex-wrap gap-1">
                          {v.keyPhrases.map((phrase, pIdx) => (
                            <span key={pIdx} className="bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                              "{phrase}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {v.bannedWords && v.bannedWords.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-rose-400/80 font-bold block uppercase">🚫 Banned Words:</span>
                        <div className="flex flex-wrap gap-1">
                          {v.bannedWords.map((word, wIdx) => (
                            <span key={wIdx} className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] line-through">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {v.notes && (
                      <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800/80 italic">
                        "{v.notes}"
                      </p>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => triggerCopy(v.id, `${v.title}: ${v.tone}`)}
                        className="text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center space-x-1"
                      >
                        {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Summary</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyVoiceToCampaign(v)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply Voice to Active Campaign</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: BOILERPLATE SIGNATURES */}
          {activeTab === "signatures" && (
            <div className="space-y-4 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-semibold">
                  Saved Company Signatures ({libraryData.signatures.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSignature(!showAddSignature)}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Signature</span>
                </button>
              </div>

              {/* Add Signature Form Drawer */}
              {showAddSignature && (
                <form onSubmit={handleAddSignature} className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30 space-y-3">
                  <h4 className="font-bold text-white text-xs">Add Boilerplate Signature</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Signature Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Primary Marketing Footer"
                        value={newSigTitle}
                        onChange={(e) => setNewSigTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Sender Name / Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Sarah, VP Marketing"
                          value={newSigSender}
                          onChange={(e) => setNewSigSender(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Company Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Corp"
                          value={newSigCompany}
                          onChange={(e) => setNewSigCompany(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Physical Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 100 Main St, Suite 400, New York, NY"
                        value={newSigAddress}
                        onChange={(e) => setNewSigAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Unsubscribe Notice Text</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. You received this because you subscribed. Click here to unsubscribe."
                        value={newSigUnsubscribe}
                        onChange={(e) => setNewSigUnsubscribe(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-1">Legal Disclaimer / Copyright</label>
                      <input
                        type="text"
                        placeholder="e.g. © 2026 Acme Inc. All rights reserved."
                        value={newSigDisclaimer}
                        onChange={(e) => setNewSigDisclaimer(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddSignature(false)}
                      className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg shadow"
                    >
                      Save Signature
                    </button>
                  </div>
                </form>
              )}

              {/* Signature Cards */}
              <div className="space-y-3">
                {libraryData.signatures.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white text-sm block">{s.title}</span>
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{s.companyName}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSignature(s.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1 font-sans">
                      <div><strong>Sender:</strong> {s.senderName}</div>
                      <div><strong>Address:</strong> {s.address}</div>
                      <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                        {s.unsubscribeText}
                      </div>
                      {s.legalDisclaimer && (
                        <div className="text-slate-500 text-[10px] font-mono">
                          {s.legalDisclaimer}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => triggerCopy(s.id, `${s.companyName}\n${s.address}\n${s.unsubscribeText}`)}
                        className="text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center space-x-1"
                      >
                        {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplySignatureToCampaign(s)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Apply Signature to Campaign Footer</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer Info */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Assets saved locally in browser</span>
          <button
            onClick={onClose}
            className="text-slate-300 font-bold hover:text-white"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
