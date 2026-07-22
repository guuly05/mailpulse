import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize Gemini client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Route: Generate Email Campaign
app.post("/api/campaign/generate", async (req, res) => {
  try {
    const {
      prompt,
      goal = "Promotional Sale",
      audience = "General Subscribers",
      tone = "Engaging & Urgency-driven",
      brandName = "Acme Brand",
      ctaText = "Shop Now",
      promoCode = "",
      visualStyle = "Modern Minimalist",
      primaryColor = "#2563eb",
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A prompt description is required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class Email Marketing Specialist and Content Strategist.
Create a complete, high-converting email marketing campaign based on the user's prompt and specifications.
Focus on high open rates, strong click-through rates (CTR), clear messaging hierarchy, and deliverability.
Return ONLY valid JSON matching the requested schema.`;

    const userPrompt = `
Generate a complete email marketing campaign:
- Campaign Concept / Brief: ${prompt}
- Campaign Goal: ${goal}
- Target Audience: ${audience}
- Brand Name: ${brandName}
- Desired Tone: ${tone}
- Primary Call to Action: ${ctaText}
${promoCode ? `- Promo / Discount Code: ${promoCode}` : ""}
- Preferred Visual Banner Style: ${visualStyle}

Ensure the response contains:
1. 4 subject line variations (Urgency-driven, Curiosity-driven, Benefit/Direct, and Personalized/Emoji) with open rate scores (0-100) and rationale.
2. Preview text / preheader (under 90 chars).
3. A detailed prompt for generating a high-quality visual banner image matching the visual style.
4. Catchy Headline and Subheadline.
5. Structured body copy (2-3 paragraphs, concise, compelling).
6. 3 Key highlights / value props (with title, description, and suggested Lucide icon name like 'Sparkles', 'Zap', 'ShieldCheck', 'Tag', 'Gift', 'Clock', 'Heart', 'Award').
7. Primary Call to Action details (button text, target URL, urgency note).
8. Secondary offer or feature spotlight section.
9. Promo code callout block details if applicable.
10. Deliverability & Spam analysis (score 0-100, identified trigger words, recommendations).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignTitle: { type: Type.STRING },
            subjectLines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  openRateScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
                required: ["text", "type", "openRateScore", "reasoning"],
              },
            },
            previewText: { type: Type.STRING },
            heroImagePrompt: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  iconName: { type: Type.STRING },
                },
                required: ["title", "description", "iconName"],
              },
            },
            primaryCTA: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                url: { type: Type.STRING },
                secondaryNote: { type: Type.STRING },
              },
              required: ["text", "url"],
            },
            promoOffer: {
              type: Type.OBJECT,
              properties: {
                badgeText: { type: Type.STRING },
                offerTitle: { type: Type.STRING },
                offerCode: { type: Type.STRING },
                expirationNotice: { type: Type.STRING },
              },
            },
            secondarySection: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                ctaUrl: { type: Type.STRING },
              },
            },
            footer: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                address: { type: Type.STRING },
                unsubscribeText: { type: Type.STRING },
              },
              required: ["companyName", "address"],
            },
            spamScoreAnalysis: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                grade: { type: Type.STRING },
                triggerWordsFound: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["score", "grade", "triggerWordsFound", "recommendations"],
            },
          },
          required: [
            "campaignTitle",
            "subjectLines",
            "previewText",
            "heroImagePrompt",
            "headline",
            "subheadline",
            "bodyParagraphs",
            "keyHighlights",
            "primaryCTA",
            "footer",
            "spamScoreAnalysis",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const campaignData = JSON.parse(jsonText);

    res.json({ success: true, campaign: campaignData });
  } catch (error: any) {
    console.error("Error generating campaign:", error);
    res.status(500).json({
      error: error.message || "Failed to generate email campaign.",
    });
  }
});

// API Route: Generate AI Image Banner
app.post("/api/campaign/image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    const ai = getGeminiClient();

    // Use gemini-3.1-flash-lite-image for general image generation
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `High-quality email marketing header banner. ${prompt}. Professional, clean lighting, vector or photographic aesthetic, wide landscape 16:9 framing, no text overlays on image.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      // Return high-quality Unsplash fallbacks if image model returns empty
      const query = encodeURIComponent(prompt.slice(0, 30));
      imageUrl = `https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80`;
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("Error generating image:", error);
    // Graceful fallback to thematic Unsplash image on error
    const fallbackUrl = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80`;
    res.json({
      success: false,
      error: error.message,
      imageUrl: fallbackUrl,
    });
  }
});

// API Route: Refine Campaign
app.post("/api/campaign/refine", async (req, res) => {
  try {
    const { currentCampaign, instruction } = req.body;

    if (!currentCampaign || !instruction) {
      return res.status(400).json({ error: "Current campaign and instruction are required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert AI Email Copywriter. Modify the existing JSON campaign data according to the user's refinement instruction. Return ONLY updated JSON matching the schema.`;

    const userPrompt = `
Current Campaign JSON:
${JSON.stringify(currentCampaign, null, 2)}

Refinement Request:
${instruction}

Please update the campaign fields appropriately while maintaining high quality and valid structure.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const updatedCampaign = JSON.parse(jsonText);

    res.json({ success: true, campaign: updatedCampaign });
  } catch (error: any) {
    console.error("Error refining campaign:", error);
    res.status(500).json({ error: error.message || "Failed to refine campaign." });
  }
});

// API Route: Generate A/B Split Test Challenger Variant (Variant B)
app.post("/api/campaign/generate-variant", async (req, res) => {
  try {
    const { currentCampaign, strategy = "Test Storytelling & Curiosity Hook vs Direct Urgency" } = req.body;

    if (!currentCampaign) {
      return res.status(400).json({ error: "Current base campaign is required to generate a variant." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a Conversion Rate Optimization (CRO) and Email A/B Testing Expert.
Create a distinct, high-converting Variant B (Challenger) email campaign to split-test against the baseline Variant A.
Test different hypotheses (e.g. Curiosity vs Urgency, Short vs Detailed Copy, Storytelling vs Direct Discount).
Return ONLY valid JSON matching the requested Variant schema.`;

    const userPrompt = `
Baseline Campaign (Variant A):
- Title: ${currentCampaign.campaignTitle}
- Headline: ${currentCampaign.headline}
- Subject: ${currentCampaign.subjectLines?.[0]?.text || "N/A"}
- Body Summary: ${currentCampaign.bodyParagraphs?.join(" ") || ""}
- Brand: ${currentCampaign.brandName}

Split-Test Strategy / Hypothesis:
"${strategy}"

Generate a complete Variant B challenger campaign including:
1. Variant Name (e.g. "Variant B: Curiosity & Storytelling Angle")
2. Hypothesis statement explaining what is being tested.
3. 4 new distinct Subject Lines matching the new angle with open rate scores.
4. Preview text (under 90 chars).
5. Catchy headline and subheadline matching the new strategy.
6. Reframed body copy (2-3 paragraphs with distinct narrative framing).
7. 3 Key highlights / value props tailored to Variant B strategy.
8. Primary Call to Action button text and secondary note.
9. Promo offer details if applicable.
10. Hero image prompt for a distinct visual banner.
11. Deliverability & Spam Analysis for Variant B.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variantName: { type: Type.STRING },
            hypothesis: { type: Type.STRING },
            subjectLines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  openRateScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
                required: ["text", "type", "openRateScore", "reasoning"],
              },
            },
            previewText: { type: Type.STRING },
            heroImagePrompt: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  iconName: { type: Type.STRING },
                },
                required: ["title", "description", "iconName"],
              },
            },
            primaryCTA: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                url: { type: Type.STRING },
                secondaryNote: { type: Type.STRING },
              },
              required: ["text", "url"],
            },
            promoOffer: {
              type: Type.OBJECT,
              properties: {
                badgeText: { type: Type.STRING },
                offerTitle: { type: Type.STRING },
                offerCode: { type: Type.STRING },
                expirationNotice: { type: Type.STRING },
              },
            },
            secondarySection: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                ctaUrl: { type: Type.STRING },
              },
            },
            spamScoreAnalysis: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                grade: { type: Type.STRING },
                triggerWordsFound: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["score", "grade", "triggerWordsFound", "recommendations"],
            },
          },
          required: [
            "variantName",
            "hypothesis",
            "subjectLines",
            "previewText",
            "heroImagePrompt",
            "headline",
            "subheadline",
            "bodyParagraphs",
            "keyHighlights",
            "primaryCTA",
            "spamScoreAnalysis",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const variantB = JSON.parse(jsonText);

    res.json({ success: true, variantB });
  } catch (error: any) {
    console.error("Error generating variant:", error);
    res.status(500).json({ error: error.message || "Failed to generate challenger variant." });
  }
});

// Start Express and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
