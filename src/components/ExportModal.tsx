import React, { useState } from "react";
import { EmailCampaign } from "../types";
import { generateEmailHTML } from "../utils/htmlGenerator";
import { Code, Check, Copy, Download, FileText, Send, X, ExternalLink } from "lucide-react";

interface ExportModalProps {
  campaign: EmailCampaign;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ campaign, onClose }) => {
  const [activeTab, setActiveTab] = useState<"html" | "text" | "test">("html");
  const [copied, setCopied] = useState(false);
  const [testEmail, setTestEmail] = useState("subscriber@example.com");
  const [testSent, setTestSent] = useState(false);

  const rawHTML = generateEmailHTML(campaign);

  const activeSubject =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text ||
    campaign.subjectLines[0]?.text ||
    campaign.campaignTitle;

  const plainText = `SUBJECT: ${activeSubject}
PREVIEW TEXT: ${campaign.previewText}

${campaign.headline.toUpperCase()}
${campaign.subheadline}

${campaign.bodyParagraphs.join("\n\n")}

${campaign.promoOffer?.offerCode ? `SPECIAL OFFER: Use code ${campaign.promoOffer.offerCode} at checkout!` : ""}

${campaign.keyHighlights.map((h) => `- ${h.title}: ${h.description}`).join("\n")}

[ ${campaign.primaryCTA.text} ]: ${campaign.primaryCTA.url}

--
${campaign.footer.companyName}
${campaign.footer.address}
To unsubscribe, click here.
`;

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([rawHTML], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${campaign.campaignTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-email.html`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Export Email Marketing Campaign</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 my-4 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("html")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "html" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            HTML Email Code
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "text" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Plain Text Version
          </button>
          <button
            onClick={() => setActiveTab("test")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === "test" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Send Test Preview
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto my-2 pr-1">
          {activeTab === "html" && (
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Production-grade, inline-styled HTML optimized for Mailchimp, Klaviyo, HubSpot, SendGrid, and all major email providers.
              </p>
              <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[320px] border border-slate-800 selection:bg-blue-500 selection:text-white">
                {rawHTML}
              </pre>
            </div>
          )}

          {activeTab === "text" && (
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Plain text fallback for accessibility and low-bandwidth email clients.
              </p>
              <textarea
                readOnly
                rows={12}
                value={plainText}
                className="w-full bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-200 border border-slate-800 focus:outline-none resize-none"
              />
            </div>
          )}

          {activeTab === "test" && (
            <div className="py-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Simulate Test Email Delivery</h4>
                    <p className="text-xs text-slate-400">Send a test preview to review layout in inbox environments</p>
                  </div>
                </div>

                <form onSubmit={handleSendTest} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Recipient Email Address</label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {testSent && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Test email preview simulated successfully to {testEmail}!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg shadow-md transition"
                  >
                    Simulate Inbox Dispatch
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handleDownloadHTML}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Download .HTML File</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(activeTab === "text" ? plainText : rawHTML)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{activeTab === "text" ? "Copy Plain Text" : "Copy HTML Code"}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
