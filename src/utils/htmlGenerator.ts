import { EmailCampaign } from "../types";

export function generateEmailHTML(campaign: EmailCampaign): string {
  const activeSubject =
    campaign.subjectLines[campaign.selectedSubjectIndex]?.text ||
    campaign.subjectLines[0]?.text ||
    campaign.campaignTitle;

  const highlightsHTML = campaign.keyHighlights
    .map(
      (h) => `
    <tr>
      <td style="padding: 12px 16px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 12px; font-family: sans-serif;">
        <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">${escapeHtml(h.title)}</strong>
        <span style="color: #475569; font-size: 14px; line-height: 1.5;">${escapeHtml(h.description)}</span>
      </td>
    </tr>
    <tr><td height="10"></td></tr>
  `
    )
    .join("");

  const paragraphsHTML = campaign.bodyParagraphs
    .map(
      (p) => `
    <p style="margin: 0 0 16px 0; color: ${campaign.textColor || '#334155'}; font-size: 16px; line-height: 1.6; font-family: sans-serif;">
      ${escapeHtml(p)}
    </p>
  `
    )
    .join("");

  const promoOfferHTML = campaign.promoOffer?.offerCode
    ? `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td align="center" style="background-color: #f1f5f9; border: 2px dashed ${campaign.primaryColor}; border-radius: 12px; padding: 20px;">
          ${campaign.promoOffer.badgeText ? `<span style="display: inline-block; background-color: ${campaign.primaryColor}; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; margin-bottom: 8px;">${escapeHtml(campaign.promoOffer.badgeText)}</span>` : ""}
          <div style="font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 6px; font-family: sans-serif;">${escapeHtml(campaign.promoOffer.offerTitle || 'Exclusive Offer')}</div>
          <div style="font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 2px; color: ${campaign.primaryColor}; background-color: #ffffff; display: inline-block; padding: 8px 20px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 8px 0;">
            ${escapeHtml(campaign.promoOffer.offerCode)}
          </div>
          ${campaign.promoOffer.expirationNotice ? `<div style="font-size: 12px; color: #64748b; margin-top: 6px; font-family: sans-serif;">${escapeHtml(campaign.promoOffer.expirationNotice)}</div>` : ""}
        </td>
      </tr>
    </table>
  `
    : "";

  const secondarySectionHTML = campaign.secondarySection?.title
    ? `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
      <tr>
        <td>
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: bold; font-family: sans-serif;">${escapeHtml(campaign.secondarySection.title)}</h3>
          <p style="margin: 0 0 16px 0; color: #475569; font-size: 14px; line-height: 1.5; font-family: sans-serif;">${escapeHtml(campaign.secondarySection.description)}</p>
          ${
            campaign.secondarySection.ctaText
              ? `<a href="${escapeHtml(campaign.secondarySection.ctaUrl || '#')}" style="color: ${campaign.primaryColor}; font-weight: bold; font-size: 14px; text-decoration: underline; font-family: sans-serif;">${escapeHtml(campaign.secondarySection.ctaText)} &rarr;</a>`
              : ""
          }
        </td>
      </tr>
    </table>
  `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(activeSubject)}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .fallback-font {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Preheader text for email clients -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${escapeHtml(campaign.previewText)}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">

          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 24px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; font-family: sans-serif;">
                ${escapeHtml(campaign.brandName)}
              </span>
            </td>
          </tr>

          <!-- Hero Image Banner -->
          ${
            campaign.heroImageUrl
              ? `
          <tr>
            <td align="center" style="padding: 0;">
              <img src="${escapeHtml(campaign.heroImageUrl)}" alt="Campaign Visual Banner" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
            </td>
          </tr>
          `
              : ""
          }

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 32px 28px;">
              <!-- Main Headline -->
              <h1 style="margin: 0 0 8px 0; color: #0f172a; font-size: 26px; font-weight: 800; line-height: 1.25; font-family: sans-serif;">
                ${escapeHtml(campaign.headline)}
              </h1>

              <!-- Subheadline -->
              ${
                campaign.subheadline
                  ? `<p style="margin: 0 0 24px 0; color: #64748b; font-size: 16px; font-weight: 500; line-height: 1.4; font-family: sans-serif;">${escapeHtml(campaign.subheadline)}</p>`
                  : ""
              }

              <!-- Body Paragraphs -->
              ${paragraphsHTML}

              <!-- Promo Code Block -->
              ${promoOfferHTML}

              <!-- Key Highlights Grid -->
              ${
                campaign.keyHighlights.length > 0
                  ? `
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0 16px 0;">
                ${highlightsHTML}
              </table>
              `
                  : ""
              }

              <!-- Primary CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(campaign.primaryCTA.url || '#')}" target="_blank" style="display: inline-block; background-color: ${campaign.primaryCTA.buttonColor || campaign.primaryColor}; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: sans-serif;">
                      ${escapeHtml(campaign.primaryCTA.text)}
                    </a>
                  </td>
                </tr>
                ${
                  campaign.primaryCTA.secondaryNote
                    ? `
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <span style="font-size: 12px; color: #94a3b8; font-family: sans-serif;">${escapeHtml(campaign.primaryCTA.secondaryNote)}</span>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <!-- Secondary Section -->
              ${secondarySectionHTML}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-family: sans-serif;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #475569;">
                ${escapeHtml(campaign.footer.companyName)}
              </p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.4;">
                ${escapeHtml(campaign.footer.address)}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                You are receiving this email because you subscribed to updates from ${escapeHtml(campaign.brandName)}.
                <br />
                <a href="#" style="color: #64748b; text-decoration: underline;">${escapeHtml(campaign.footer.unsubscribeText || 'Unsubscribe')}</a> | <a href="#" style="color: #64748b; text-decoration: underline;">Manage Preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

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
