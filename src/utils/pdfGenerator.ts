import { EmailCampaign } from "../types";

export function generatePrintablePDFHTML(campaign: EmailCampaign): string {
  const activeSubject =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text ||
    campaign.subjectLines[0]?.text ||
    campaign.campaignTitle;

  const activeSubjectScore =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.openRateScore || 85;

  const primaryColor = campaign.primaryColor || "#3b82f6";

  const paragraphsHTML = campaign.bodyParagraphs
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6; font-family: sans-serif;">${escapeHtml(
          p
        )}</p>`
    )
    .join("");

  const highlightsHTML = campaign.keyHighlights
    .map(
      (h) => `
    <div style="padding: 12px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; page-break-inside: avoid;">
      <strong style="color: #0f172a; font-size: 14px; display: block; margin-bottom: 3px;">${escapeHtml(
        h.title
      )}</strong>
      <span style="color: #475569; font-size: 13px; line-height: 1.5;">${escapeHtml(
        h.description
      )}</span>
    </div>
  `
    )
    .join("");

  const promoOfferHTML = campaign.promoOffer?.offerCode
    ? `
    <div style="margin: 20px 0; padding: 20px; text-align: center; background-color: #f8fafc; border: 2px dashed ${primaryColor}; border-radius: 12px; page-break-inside: avoid;">
      ${
        campaign.promoOffer.badgeText
          ? `<span style="display: inline-block; background-color: ${primaryColor}; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; margin-bottom: 8px;">${escapeHtml(
              campaign.promoOffer.badgeText
            )}</span>`
          : ""
      }
      <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">${escapeHtml(
        campaign.promoOffer.offerTitle || "Special Offer"
      )}</div>
      <div style="font-size: 22px; font-weight: bold; font-family: monospace; letter-spacing: 2px; color: ${primaryColor}; background-color: #ffffff; display: inline-block; padding: 6px 16px; border-radius: 6px; border: 1px solid #cbd5e1; margin: 6px 0;">
        ${escapeHtml(campaign.promoOffer.offerCode)}
      </div>
      ${
        campaign.promoOffer.expirationNotice
          ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px;">${escapeHtml(
              campaign.promoOffer.expirationNotice
            )}</div>`
          : ""
      }
    </div>
  `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(campaign.campaignTitle)} - Email Campaign Brief</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .pdf-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
    }
    .pdf-header-meta {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .pdf-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .pdf-meta-item {
      font-size: 12px;
    }
    .pdf-meta-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      color: #64748b;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }
    .pdf-meta-val {
      font-weight: 600;
      color: #0f172a;
    }
    .email-container-box {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-top: 20px;
    }
    .brand-banner {
      background-color: #ffffff;
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .hero-img {
      width: 100%;
      height: auto;
      display: block;
      max-height: 280px;
      object-fit: cover;
    }
    .body-content {
      padding: 28px 24px;
    }
    .btn-cta {
      display: inline-block;
      background-color: ${primaryColor};
      color: #ffffff !important;
      font-size: 15px;
      font-weight: bold;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0 10px 0;
    }
    .footer-box {
      background-color: #f8fafc;
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .no-print {
      margin-bottom: 20px;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      .pdf-page {
        padding: 0;
        width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="pdf-page">
    
    <!-- Printable Document Header -->
    <div class="pdf-header-meta">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${primaryColor}; letter-spacing: 1px;">
            AI Campaign Brief & Document Export
          </span>
          <h1 style="margin: 4px 0 0 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            ${escapeHtml(campaign.campaignTitle)}
          </h1>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          Printed on: ${new Date().toLocaleDateString()}
        </div>
      </div>

      <div class="pdf-meta-grid">
        <div class="pdf-meta-item">
          <span class="pdf-meta-label">Brand Name</span>
          <span class="pdf-meta-val">${escapeHtml(campaign.brandName)}</span>
        </div>
        <div class="pdf-meta-item">
          <span class="pdf-meta-label">Subject Line (Score: ${activeSubjectScore}/100)</span>
          <span class="pdf-meta-val">${escapeHtml(activeSubject)}</span>
        </div>
        <div class="pdf-meta-item">
          <span class="pdf-meta-label">Preview Text</span>
          <span class="pdf-meta-val">${escapeHtml(campaign.previewText)}</span>
        </div>
        <div class="pdf-meta-item">
          <span class="pdf-meta-label">Target Goal</span>
          <span class="pdf-meta-val">${escapeHtml(campaign.primaryCTA.text)}</span>
        </div>
        ${
          campaign.sendTimeRecommendation
            ? `
        <div class="pdf-meta-item" style="grid-column: span 2;">
          <span class="pdf-meta-label">Optimal Send Window</span>
          <span class="pdf-meta-val" style="color: #7e22ce;">📅 ${escapeHtml(
            campaign.sendTimeRecommendation.recommendedDateTime
          )} (${escapeHtml(campaign.sendTimeRecommendation.engagementBoost)})</span>
        </div>
        `
            : ""
        }
      </div>
    </div>

    <!-- Email Visual Mockup -->
    <div class="email-container-box">
      <div class="brand-banner">
        ${escapeHtml(campaign.brandName)}
      </div>

      ${
        campaign.heroImageUrl
          ? `<img src="${escapeHtml(
              campaign.heroImageUrl
            )}" alt="Hero Banner" class="hero-img" />`
          : ""
      }

      <div class="body-content">
        <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
          ${escapeHtml(campaign.headline)}
        </h2>

        ${
          campaign.subheadline
            ? `<p style="margin: 0 0 20px 0; font-size: 15px; font-weight: 500; color: #64748b;">${escapeHtml(
                campaign.subheadline
              )}</p>`
            : ""
        }

        ${paragraphsHTML}

        ${promoOfferHTML}

        ${
          campaign.keyHighlights.length > 0
            ? `<div style="margin: 20px 0;">${highlightsHTML}</div>`
            : ""
        }

        <div style="text-align: center;">
          <a href="${escapeHtml(
            campaign.primaryCTA.url || "#"
          )}" class="btn-cta">
            ${escapeHtml(campaign.primaryCTA.text)}
          </a>
          ${
            campaign.primaryCTA.secondaryNote
              ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${escapeHtml(
                  campaign.primaryCTA.secondaryNote
                )}</div>`
              : ""
          }
        </div>
      </div>

      <div class="footer-box">
        <strong>${escapeHtml(campaign.footer.companyName)}</strong><br />
        ${escapeHtml(campaign.footer.address)}<br />
        <span style="font-size: 10px; color: #94a3b8;">${escapeHtml(
          campaign.footer.unsubscribeText || "Unsubscribe"
        )}</span>
      </div>
    </div>

  </div>

</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
