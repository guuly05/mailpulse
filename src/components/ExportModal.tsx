import React, { useState } from "react";
import { EmailCampaign } from "../types";
import { generateEmailHTML } from "../utils/htmlGenerator";
import { generatePrintablePDFHTML } from "../utils/pdfGenerator";
import { Code, Check, Copy, Download, FileText, Send, X, Printer, FileCheck } from "lucide-react";

interface ExportModalProps {
  campaign: EmailCampaign;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ campaign, onClose }) => {
  const [activeTab, setActiveTab] = useState<"html" | "text" | "pdf" | "test">("html");
  const [selectedVariant, setSelectedVariant] = useState<"A" | "B">("A");
  const [copied, setCopied] = useState(false);
  const [testEmail, setTestEmail] = useState("subscriber@example.com");
  const [testSent, setTestSent] = useState(false);

  const activeCampaignToExport: EmailCampaign =
    selectedVariant === "B" && campaign.variantB
      ? {
          ...campaign,
          subjectLines: campaign.variantB.subjectLines,
          selectedSubjectIndex: campaign.variantB.selectedSubjectIndex,
          previewText: campaign.variantB.previewText,
          heroImagePrompt: campaign.variantB.heroImagePrompt,
          heroImageUrl: campaign.variantB.heroImageUrl || campaign.heroImageUrl,
          headline: campaign.variantB.headline,
          subheadline: campaign.variantB.subheadline,
          bodyParagraphs: campaign.variantB.bodyParagraphs,
          keyHighlights: campaign.variantB.keyHighlights,
          primaryCTA: campaign.variantB.primaryCTA,
          promoOffer: campaign.variantB.promoOffer,
          secondarySection: campaign.variantB.secondarySection,
          spamScoreAnalysis: campaign.variantB.spamScoreAnalysis,
        }
      : campaign;

  const rawHTML = generateEmailHTML(activeCampaignToExport);
  const printablePDFHTML = generatePrintablePDFHTML(activeCampaignToExport);

  const activeSubject =
    activeCampaignToExport.subjectLines[activeCampaignToExport.selectedSubjectIndex]?.text ||
    activeCampaignToExport.subjectLines[0]?.text ||
    activeCampaignToExport.campaignTitle;

  const plainText = `SUBJECT: ${activeSubject}
PREVIEW TEXT: ${activeCampaignToExport.previewText}

${activeCampaignToExport.headline.toUpperCase()}
${activeCampaignToExport.subheadline}

${activeCampaignToExport.bodyParagraphs.join("\n\n")}

${activeCampaignToExport.promoOffer?.offerCode ? `SPECIAL OFFER: Use code ${activeCampaignToExport.promoOffer.offerCode} at checkout!` : ""}

${activeCampaignToExport.keyHighlights.map((h) => `- ${h.title}: ${h.description}`).join("\n")}

[ ${activeCampaignToExport.primaryCTA.text} ]: ${activeCampaignToExport.primaryCTA.url}

--
${activeCampaignToExport.footer.companyName}
${activeCampaignToExport.footer.address}
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

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(printablePDFHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
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

        {/* Variant Selector if A/B Split Test Exists */}
        {campaign.variantB && (
          <div className="mt-3 bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Select Export Variant:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedVariant("A")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedVariant === "A"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                Variant A (Control)
              </button>
              <button
                onClick={() => setSelectedVariant("B")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedVariant === "B"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                Variant B (Challenger)
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex space-x-1 my-4 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("html")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "html" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            HTML Email Code
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "pdf" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📄 PDF Document
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "text" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Plain Text
          </button>
          <button
            onClick={() => setActiveTab("test")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === "test" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Send Test
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

          {activeTab === "pdf" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl">
                <div className="flex items-center space-x-2 text-xs">
                  <Printer className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Print-Ready Executive Campaign PDF</span>
                    <span className="text-purple-300 text-[11px]">Formatted with metadata, subject line scoring, and layout brief.</span>
                  </div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-md transition shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download / Print PDF</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-white h-[320px] shadow-inner">
                <iframe
                  title="PDF Print Preview"
                  srcDoc={printablePDFHTML}
                  className="w-full h-full border-none"
                />
              </div>
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
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadHTML}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download .HTML</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-1.5 bg-purple-900/50 hover:bg-purple-900/80 text-purple-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-700/50 transition"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>Save as PDF</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(activeTab === "text" ? plainText : rawHTML)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{activeTab === "text" ? "Copy Plain Text" : "Copy HTML"}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

