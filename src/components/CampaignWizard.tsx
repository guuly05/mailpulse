import React, { useState } from "react";
import { Sparkles, Wand2, Target, Users, MessageSquare, Palette, Tag, Building2, Flame, Rocket, Award, ShoppingCart, ArrowRight } from "lucide-react";
import { CampaignGenerationOptions } from "../types";
import { CAMPAIGN_PRESETS } from "../data/presets";

interface CampaignWizardProps {
  onGenerate: (options: CampaignGenerationOptions) => void;
  isGenerating: boolean;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState("");
  const [brandName, setBrandName] = useState("Aura Apparel");
  const [goal, setGoal] = useState("Promotional Sale");
  const [audience, setAudience] = useState("General Subscribers");
  const [tone, setTone] = useState("Engaging & Urgency-driven");
  const [ctaText, setCtaText] = useState("Shop Discount Now");
  const [promoCode, setPromoCode] = useState("SUMMER30");
  const [visualStyle, setVisualStyle] = useState("Modern Minimalist Studio");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectPreset = (presetOptions: CampaignGenerationOptions) => {
    setPrompt(presetOptions.prompt);
    setGoal(presetOptions.goal);
    setAudience(presetOptions.audience);
    setTone(presetOptions.tone);
    setBrandName(presetOptions.brandName);
    setCtaText(presetOptions.ctaText);
    setPromoCode(presetOptions.promoCode || "");
    setVisualStyle(presetOptions.visualStyle);
    setPrimaryColor(presetOptions.primaryColor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onGenerate({
      prompt: prompt.trim(),
      goal,
      audience,
      tone,
      brandName: brandName.trim() || "Acme Brand",
      ctaText: ctaText.trim() || "Learn More",
      promoCode: promoCode.trim(),
      visualStyle,
      primaryColor,
    });
  };

  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame": return <Flame className="w-4 h-4 text-orange-500" />;
      case "Rocket": return <Rocket className="w-4 h-4 text-blue-500" />;
      case "Sparkles": return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case "Award": return <Award className="w-4 h-4 text-amber-500" />;
      case "ShoppingCart": return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      default: return <Wand2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div id="campaign-wizard-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 mb-8">
      
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Campaign Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            What are you marketing today?
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Describe your offer or goal. AI will generate subject lines, body copy, CTAs, and visual banner graphics.
          </p>
        </div>

        {/* Brand Name Quick Input */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center space-x-3 max-w-xs">
          <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="w-full">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Brand / Company</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your Brand Name"
              className="bg-transparent text-sm font-medium text-white focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Preset Inspirations */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 block">
          Quick Start Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CAMPAIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.options)}
              className="group flex flex-col justify-between text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition duration-150"
            >
              <div className="flex items-center space-x-2 mb-1.5">
                {renderPresetIcon(preset.icon)}
                <span className="font-semibold text-xs text-slate-200 group-hover:text-blue-400 transition truncate">
                  {preset.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="prompt-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Campaign Brief / Concept Prompt
          </label>
          <div className="relative">
            <textarea
              id="prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Summer clearance sale for an eco-friendly activewear brand offering 30% off, highlighting sustainable bamboo fabrics, free shipping over $50, and 48-hour urgency..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="absolute right-3 bottom-3 text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{showAdvanced ? "Hide Fine Tuning" : "Fine Tune Campaign"}</span>
            </button>
          </div>
        </div>

        {/* Advanced Fine Tuning Options */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            {/* Goal */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Campaign Goal</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Promotional Sale">Promotional Sale / Discount</option>
                <option value="Product Announcement">New Product Launch</option>
                <option value="Welcome & Onboarding">Welcome Series</option>
                <option value="Event RSVP & Engagement">Event / Webinar RSVP</option>
                <option value="Customer Reactivation">Cart Recovery / Winback</option>
                <option value="Newsletter & Educational">Content Newsletter</option>
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Audience</span>
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. VIP Subscribers"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tone of Voice</span>
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Engaging & Urgency-driven">Engaging & Urgent</option>
                <option value="Warm, Friendly & Premium">Warm & Friendly</option>
                <option value="Professional, Clean & Direct">Professional & Direct</option>
                <option value="Playful, Witty & Casual">Playful & Witty</option>
                <option value="Exclusive & Luxury">Exclusive Luxury</option>
              </select>
            </div>

            {/* Promo Code & CTA */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Promo Code / Coupon</span>
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. SUMMER30"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono"
              />
            </div>

            {/* Primary Accent Color */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Primary Button Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-slate-900 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{primaryColor}</span>
              </div>
            </div>

            {/* Visual Banner Style */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Visual Banner Aesthetic</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Vibrant Summer Sunset">Vibrant & High Energy</option>
                <option value="Modern Minimalist Studio">Modern Minimalist Product Studio</option>
                <option value="Warm Organic & Botanical">Warm Organic & Natural</option>
                <option value="Sleek Dark Tech & Neon">Sleek Dark Tech & Cyber</option>
                <option value="Luxury Elegant Gold & Black">Luxury High-End Editorial</option>
              </select>
            </div>

          </div>
        )}

        {/* Generate Button */}
        <div className="flex items-center justify-end">
          <button
            id="generate-campaign-btn"
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition duration-150 flex items-center justify-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Campaign & Generating Visuals...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Full Campaign</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
