import React from "react";
import { EmailCampaign } from "../types";
import { History, X, Trash2, ArrowRight, Sparkles, Mail } from "lucide-react";

interface SavedCampaignsDrawerProps {
  campaigns: EmailCampaign[];
  onSelectCampaign: (campaign: EmailCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onClose: () => void;
  activeCampaignId?: string;
}

export const SavedCampaignsDrawer: React.FC<SavedCampaignsDrawerProps> = ({
  campaigns,
  onSelectCampaign,
  onDeleteCampaign,
  onClose,
  activeCampaignId,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 max-w-md w-full h-full p-6 text-slate-100 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Saved Campaigns History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-semibold">No saved campaigns yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Generated campaigns will automatically be saved here.
              </p>
            </div>
          ) : (
            campaigns.map((c) => {
              const isActive = c.id === activeCampaignId;
              const dateStr = new Date(c.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCampaign(c);
                    onClose();
                  }}
                  className={`group p-4 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                    isActive
                      ? "bg-slate-800 border-blue-500 ring-1 ring-blue-500/50"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                        {c.brandName}
                      </span>
                      <span className="text-[10px] text-slate-500">{dateStr}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 truncate group-hover:text-blue-300 transition">
                      {c.campaignTitle}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {c.subjectLines[c.selectedSubjectIndex]?.text || c.headline}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        Score: {c.spamScoreAnalysis?.score || 90}/100
                      </span>
                      {c.promoOffer?.offerCode && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          {c.promoOffer.offerCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCampaign(c.id);
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 transition"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition mt-4" />
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            {campaigns.length} total saved campaign{campaigns.length === 1 ? "" : "s"} stored in browser memory.
          </p>
        </div>

      </div>
    </div>
  );
};
