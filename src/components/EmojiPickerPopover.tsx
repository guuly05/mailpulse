import React, { useState } from "react";
import { Search, X, Smile, Sparkles, Flame, Tag, TrendingUp, Heart } from "lucide-react";

interface EmojiPickerPopoverProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  title?: string;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: { char: string; keywords: string[] }[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "urgency",
    name: "Urgency & Deals",
    icon: "🔥",
    emojis: [
      { char: "🔥", keywords: ["fire", "hot", "deal", "trending", "urgency"] },
      { char: "⚡", keywords: ["zap", "flash", "lightning", "sale", "fast"] },
      { char: "⏰", keywords: ["clock", "time", "limited", "expires", "hurry"] },
      { char: "⏳", keywords: ["hourglass", "ending", "soon", "last chance"] },
      { char: "🚨", keywords: ["alert", "siren", "warning", "important"] },
      { char: "💥", keywords: ["boom", "blast", "huge", "impact"] },
      { char: "⌛", keywords: ["timer", "countdown", "running out"] },
      { char: "🔔", keywords: ["bell", "reminder", "notification"] },
    ],
  },
  {
    id: "offers",
    name: "Promotions & Discounts",
    icon: "🎁",
    emojis: [
      { char: "🎁", keywords: ["gift", "present", "free", "bonus"] },
      { char: "🏷️", keywords: ["tag", "discount", "price", "coupon"] },
      { char: "💸", keywords: ["money", "savings", "discount", "cash"] },
      { char: "💰", keywords: ["moneybag", "wealth", "cash", "save"] },
      { char: "🛒", keywords: ["cart", "shopping", "buy", "store"] },
      { char: "🛍️", keywords: ["bags", "shopping", "retail"] },
      { char: "💎", keywords: ["gem", "diamond", "premium", "exclusive"] },
      { char: "🎟️", keywords: ["ticket", "pass", "access", "vip"] },
    ],
  },
  {
    id: "attention",
    name: "Sparkle & Hook",
    icon: "✨",
    emojis: [
      { char: "✨", keywords: ["sparkles", "magic", "new", "special"] },
      { char: "🌟", keywords: ["star", "glowing", "top", "best"] },
      { char: "🚀", keywords: ["rocket", "launch", "boost", "growth"] },
      { char: "💡", keywords: ["idea", "bulb", "tip", "insight"] },
      { char: "🎉", keywords: ["party", "tada", "celebrate", "announcement"] },
      { char: "📣", keywords: ["megaphone", "announce", "news", "shout"] },
      { char: "🎯", keywords: ["target", "bullseye", "goal", "focus"] },
      { char: "💌", keywords: ["letter", "love", "email", "envelope"] },
      { char: "🏆", keywords: ["trophy", "winner", "award", "number1"] },
      { char: "🤩", keywords: ["starstruck", "wow", "amazing"] },
    ],
  },
  {
    id: "trust",
    name: "Trust & Value",
    icon: "📈",
    emojis: [
      { char: "📈", keywords: ["chart", "growth", "results", "stats"] },
      { char: "🔒", keywords: ["lock", "secure", "private", "guarantee"] },
      { char: "✅", keywords: ["check", "done", "verified", "approved"] },
      { char: "🔑", keywords: ["key", "unlock", "secret", "access"] },
      { char: "📌", keywords: ["pin", "notice", "important"] },
      { char: "🙌", keywords: ["hands", "celebration", "praise"] },
      { char: "👀", keywords: ["eyes", "look", "peek", "watch"] },
      { char: "💯", keywords: ["100", "perfect", "score"] },
      { char: "❤️", keywords: ["heart", "love", "favorite"] },
      { char: "🤝", keywords: ["handshake", "partner", "welcome"] },
    ],
  },
];

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  onSelectEmoji,
  onClose,
  title = "Insert Brand Emoji",
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCategories = EMOJI_CATEGORIES.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const q = searchQuery.toLowerCase();
    const matchingEmojis = cat.emojis.filter(
      (e) =>
        e.keywords.some((kw) => kw.includes(q)) ||
        e.char.includes(q)
    );
    return { ...cat, emojis: matchingEmojis };
  }).filter((cat) => cat.emojis.length > 0);

  return (
    <div className="absolute z-50 mt-2 right-0 w-72 sm:w-80 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100 ring-1 ring-slate-700/50">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smile className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs text-white">{title}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis (e.g. fire, sale, star)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      {!searchQuery && (
        <div className="flex items-center space-x-1 p-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
              activeCategory === "all"
                ? "bg-amber-500 text-slate-950 font-extrabold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All
          </button>
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition flex items-center space-x-1 ${
                activeCategory === cat.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid Container */}
      <div className="p-3 max-h-56 overflow-y-auto space-y-3">
        {filteredCategories.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No emojis found for "{searchQuery}".
          </p>
        ) : (
          filteredCategories
            .filter((cat) => activeCategory === "all" || activeCategory === cat.id || searchQuery)
            .map((cat) => (
              <div key={cat.id} className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                  {cat.icon} {cat.name}
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
                  {cat.emojis.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectEmoji(item.char)}
                      className="w-9 h-9 text-lg flex items-center justify-center rounded-xl hover:bg-slate-800 hover:scale-125 transition transform active:scale-95"
                      title={item.keywords.join(", ")}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        Click an emoji to insert into your subject line
      </div>
    </div>
  );
};
