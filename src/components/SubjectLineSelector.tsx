import React, { useState } from "react";
import { SubjectLine } from "../types";
import { CheckCircle2, Flame, HelpCircle, Target, Sparkles, Edit3, Save, AlertCircle } from "lucide-react";

interface SubjectLineSelectorProps {
  subjectLines: SubjectLine[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  previewText: string;
  onUpdatePreviewText: (text: string) => void;
  onUpdateSubjectText: (index: number, newText: string) => void;
}

export const SubjectLineSelector: React.FC<SubjectLineSelectorProps> = ({
  subjectLines,
  selectedIndex,
  onSelectIndex,
  previewText,
  onUpdatePreviewText,
  onUpdateSubjectText,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSubjectInput, setEditSubjectInput] = useState("");
  const [editingPreview, setEditingPreview] = useState(false);
  const [editPreviewInput, setEditPreviewInput] = useState("");

  const handleStartEditSubject = (idx: number, currentText: string) => {
    setEditingIndex(idx);
    setEditSubjectInput(currentText);
  };

  const handleSaveEditSubject = (idx: number) => {
    if (editSubjectInput.trim()) {
      onUpdateSubjectText(idx, editSubjectInput.trim());
    }
    setEditingIndex(null);
  };

  const handleStartEditPreview = () => {
    setEditingPreview(true);
    setEditPreviewInput(previewText);
  };

  const handleSaveEditPreview = () => {
    onUpdatePreviewText(editPreviewInput.trim());
    setEditingPreview(false);
  };

  const getTypeBadge = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("urgency")) {
      return (
        <span className="inline-flex items-center space-x-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
          <Flame className="w-3 h-3" />
          <span>High Urgency</span>
        </span>
      );
    }
    if (typeLower.includes("curiosity")) {
      return (
        <span className="inline-flex items-center space-x-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
          <HelpCircle className="w-3 h-3" />
          <span>Curiosity Gap</span>
        </span>
      );
    }
    if (typeLower.includes("direct") || typeLower.includes("benefit")) {
      return (
        <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
          <Target className="w-3 h-3" />
          <span>Direct Offer</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
        <Sparkles className="w-3 h-3" />
        <span>Personalized</span>
      </span>
    );
  };

  return (
    <div id="subject-line-selector-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>AI Subject Lines & Inbox Preview</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-normal">
              A/B Test Options
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your primary subject line. High predicted open-rate subject lines improve campaign deliverability.
          </p>
        </div>
      </div>

      {/* Subject Lines Grid */}
      <div className="space-y-3 mb-6">
        {subjectLines.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          const charLength = item.text.length;
          const isOptimalLength = charLength >= 25 && charLength <= 55;

          return (
            <div
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`group relative p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? "bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="pt-0.5 shrink-0">
                  <CheckCircle2
                    className={`w-5 h-5 transition ${
                      isSelected ? "text-blue-400 fill-blue-500/20" : "text-slate-600 group-hover:text-slate-400"
                    }`}
                  />
                </div>

                <div className="w-full">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                    {getTypeBadge(item.type)}
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        isOptimalLength
                          ? "bg-slate-800 text-slate-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                      title={isOptimalLength ? "Optimal length for mobile & desktop" : "Consider keeping under 55 chars"}
                    >
                      {charLength} chars
                    </span>
                  </div>

                  {editingIndex === idx ? (
                    <div className="flex items-center space-x-2 mt-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editSubjectInput}
                        onChange={(e) => setEditSubjectInput(e.target.value)}
                        className="bg-slate-900 border border-blue-500 text-sm text-white rounded px-2.5 py-1 w-full focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEditSubject(idx)}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className={`text-sm sm:text-base font-semibold ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {item.text}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditSubject(idx, item.text);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                        title="Edit Subject Line"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {item.reasoning}
                  </p>
                </div>
              </div>

              {/* Predicted Open Rate Gauge */}
              <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Est. Open Rate
                </span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className={`text-base font-extrabold font-mono ${
                    item.openRateScore >= 85 ? "text-emerald-400" : item.openRateScore >= 70 ? "text-blue-400" : "text-amber-400"
                  }`}>
                    {item.openRateScore}%
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Preheader / Preview Text Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Inbox Preheader / Preview Text
          </label>

          {editingPreview ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={editPreviewInput}
                onChange={(e) => setEditPreviewInput(e.target.value)}
                className="bg-slate-900 border border-blue-500 text-xs text-white rounded px-3 py-1.5 w-full focus:outline-none"
              />
              <button
                onClick={handleSaveEditPreview}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-semibold"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{previewText}"
              </p>
              <button
                type="button"
                onClick={handleStartEditPreview}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium ml-2 shrink-0 flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
