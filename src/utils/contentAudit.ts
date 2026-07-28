import { EmailCampaign } from "../types";
import { calculateReadability, ReadabilityResult } from "./readability";

export interface ValuePropCheck {
  id: string;
  category: string;
  title: string;
  description: string;
  detected: boolean;
  matchedTerms: string[];
  excerptFound?: string;
  recommendation: string;
  impactWeight: number; // 1-10
}

export interface ComponentCharCount {
  name: string;
  text: string;
  charCount: number;
  wordCount: number;
  optimalRange: [number, number]; // [min, max]
  status: "optimal" | "short" | "long" | "missing";
  feedback: string;
}

export interface ContentAuditReport {
  overallScore: number; // 0 - 100
  gradeLetter: "A+" | "A" | "B" | "C" | "D";
  readability: ReadabilityResult;
  estimatedReadTimeSeconds: number;
  
  // Character & Structure Metrics
  totalCharsWithSpaces: number;
  totalCharsNoSpaces: number;
  componentCounts: ComponentCharCount[];
  
  // Value Prop Analysis
  valueProps: ValuePropCheck[];
  detectedValuePropCount: number;
  totalValuePropCategories: number;
  
  // Actionable Insights
  strengths: string[];
  improvements: string[];
}

export function performContentAudit(campaign: EmailCampaign | null): ContentAuditReport {
  if (!campaign) {
    return {
      overallScore: 0,
      gradeLetter: "D",
      readability: calculateReadability(""),
      estimatedReadTimeSeconds: 0,
      totalCharsWithSpaces: 0,
      totalCharsNoSpaces: 0,
      componentCounts: [],
      valueProps: [],
      detectedValuePropCount: 0,
      totalValuePropCategories: 0,
      strengths: ["No active campaign loaded."],
      improvements: ["Create or select a campaign to run content audit."],
    };
  }

  const selectedSubject = campaign.subjectLines?.[campaign.selectedSubjectIndex]?.text || campaign.subjectLines?.[0]?.text || "";
  const previewText = campaign.previewText || "";
  const headline = campaign.headline || "";
  const subheadline = campaign.subheadline || "";
  const bodyParagraphs = campaign.bodyParagraphs || [];
  const ctaText = campaign.primaryCTA?.text || "";
  const promoTitle = campaign.promoOffer?.offerTitle || "";
  const promoCode = campaign.promoOffer?.offerCode || "";
  const secondaryTitle = campaign.secondarySection?.title || "";
  const highlights = (campaign.keyHighlights || []).map((h) => `${h.title} ${h.description}`).join(". ");

  const bodyTextFull = bodyParagraphs.join("\n\n");
  const fullCopyCombined = [
    headline,
    subheadline,
    bodyTextFull,
    highlights,
    promoTitle,
    promoCode,
    secondaryTitle,
    ctaText,
  ]
    .filter(Boolean)
    .join(". ");

  // 1. Readability
  const readability = calculateReadability(fullCopyCombined);
  const estimatedReadTimeSeconds = Math.max(5, Math.round((readability.wordCount / 200) * 60));

  // 2. Component Character Counts
  const componentCounts: ComponentCharCount[] = [];

  // Subject Line (Target: 30-50 chars)
  const subjLen = selectedSubject.length;
  let subjStatus: ComponentCharCount["status"] = "optimal";
  let subjFeedback = "Perfect length for mobile inboxes (30-50 characters).";
  if (subjLen === 0) {
    subjStatus = "missing";
    subjFeedback = "Subject line is missing.";
  } else if (subjLen < 25) {
    subjStatus = "short";
    subjFeedback = "Too short; consider adding a descriptive keyword or benefit.";
  } else if (subjLen > 55) {
    subjStatus = "long";
    subjFeedback = "May get truncated on mobile devices (~50 char preview limit).";
  }
  componentCounts.push({
    name: "Subject Line",
    text: selectedSubject,
    charCount: subjLen,
    wordCount: selectedSubject.split(/\s+/).filter(Boolean).length,
    optimalRange: [30, 50],
    status: subjStatus,
    feedback: subjFeedback,
  });

  // Preview Text / Preheader (Target: 40-90 chars)
  const prevLen = previewText.length;
  let prevStatus: ComponentCharCount["status"] = "optimal";
  let prevFeedback = "Great preheader length to complement subject line.";
  if (prevLen === 0) {
    prevStatus = "missing";
    prevFeedback = "Missing preheader text. Inboxes will pull raw body text instead.";
  } else if (prevLen < 35) {
    prevStatus = "short";
    prevFeedback = "Under 35 chars; could add a secondary urgency trigger or discount note.";
  } else if (prevLen > 100) {
    prevStatus = "long";
    prevFeedback = "Slightly long; trailing text may be hidden depending on email client.";
  }
  componentCounts.push({
    name: "Preview Text (Preheader)",
    text: previewText,
    charCount: prevLen,
    wordCount: previewText.split(/\s+/).filter(Boolean).length,
    optimalRange: [40, 90],
    status: prevStatus,
    feedback: prevFeedback,
  });

  // Primary Headline (Target: 20-60 chars)
  const headLen = headline.length;
  let headStatus: ComponentCharCount["status"] = "optimal";
  let headFeedback = "Strong main headline length.";
  if (headLen === 0) {
    headStatus = "missing";
    headFeedback = "Headline is missing.";
  } else if (headLen < 15) {
    headStatus = "short";
    headFeedback = "Very brief headline; ensure the core benefit is clear immediately.";
  } else if (headLen > 75) {
    headStatus = "long";
    headFeedback = "Long headline; consider splitting into headline + subheadline.";
  }
  componentCounts.push({
    name: "Main Headline",
    text: headline,
    charCount: headLen,
    wordCount: headline.split(/\s+/).filter(Boolean).length,
    optimalRange: [20, 60],
    status: headStatus,
    feedback: headFeedback,
  });

  // Body Copy (Target: 150-600 chars)
  const bodyLen = bodyTextFull.length;
  let bodyStatus: ComponentCharCount["status"] = "optimal";
  let bodyFeedback = "Ideal body copy length for high conversion email skimming.";
  if (bodyLen === 0) {
    bodyStatus = "missing";
    bodyFeedback = "Body copy is missing.";
  } else if (bodyLen < 100) {
    bodyStatus = "short";
    bodyFeedback = "Short copy; ensure key details and value propositions are explained.";
  } else if (bodyLen > 800) {
    bodyStatus = "long";
    bodyFeedback = "Dense copy; consider converting key points into bullet highlights.";
  }
  componentCounts.push({
    name: "Body Paragraphs",
    text: bodyTextFull,
    charCount: bodyLen,
    wordCount: readability.wordCount,
    optimalRange: [150, 600],
    status: bodyStatus,
    feedback: bodyFeedback,
  });

  // Call-To-Action Button (Target: 10-25 chars)
  const ctaLen = ctaText.length;
  let ctaStatus: ComponentCharCount["status"] = "optimal";
  let ctaFeedback = "Action-oriented and punchy button text length.";
  if (ctaLen === 0) {
    ctaStatus = "missing";
    ctaFeedback = "CTA button text is missing.";
  } else if (ctaLen < 8) {
    ctaStatus = "short";
    ctaFeedback = "Generic brief CTA (e.g., 'Click Here'); specify benefit or action.";
  } else if (ctaLen > 30) {
    ctaStatus = "long";
    ctaFeedback = "Too wordy for a button; trim to 2-4 punchy action words.";
  }
  componentCounts.push({
    name: "Primary CTA Button",
    text: ctaText,
    charCount: ctaLen,
    wordCount: ctaText.split(/\s+/).filter(Boolean).length,
    optimalRange: [10, 25],
    status: ctaStatus,
    feedback: ctaFeedback,
  });

  // Totals
  const totalCharsWithSpaces = fullCopyCombined.length;
  const totalCharsNoSpaces = fullCopyCombined.replace(/\s+/g, "").length;

  // 3. Value Proposition Analysis
  const searchCopyLower = fullCopyCombined.toLowerCase();

  const VALUE_PROP_CATEGORIES: {
    id: string;
    category: string;
    title: string;
    description: string;
    keywords: string[];
    recommendation: string;
    impactWeight: number;
  }[] = [
    {
      id: "discount",
      category: "Savings & Discount",
      title: "Monetary Incentive / Savings",
      description: "Mentions discounts, sale prices, promo codes, or percentage savings.",
      keywords: ["%", "off", "save", "discount", "sale", "deal", "promo", "code", "cashback", "special price", "free", "bonus"],
      recommendation: "Add explicit savings or discount terms (e.g., 'Save 20% with code') to lower buying friction.",
      impactWeight: 9,
    },
    {
      id: "risk_reversal",
      category: "Trust & Risk Reversal",
      title: "Risk-Free / Guarantee / Free Shipping",
      description: "Assures buyers with free shipping, easy returns, or money-back guarantees.",
      keywords: ["free shipping", "guarantee", "risk-free", "no risk", "easy returns", "money-back", "cancel anytime", "no commitment", "hassle-free", "free trial"],
      recommendation: "Include a risk reversal note (e.g., 'Free shipping & 30-day money-back guarantee') near the CTA button.",
      impactWeight: 8,
    },
    {
      id: "urgency",
      category: "Urgency & Scarcity",
      title: "Time Sensitivity / Scarcity Trigger",
      description: "Creates momentum with deadlines, limited stock, or expiration notices.",
      keywords: ["today", "now", "limited", "expires", "ending", "deadline", "hours left", "last chance", "while supplies last", "hurry", "only a few"],
      recommendation: "Add a clear urgency anchor (e.g., 'Offer expires at midnight') to prompt immediate clicks.",
      impactWeight: 9,
    },
    {
      id: "benefit_outcome",
      category: "Core Value & Outcome",
      title: "Clear Transformation / Primary Benefit",
      description: "Explains what positive result, transformation, or convenience the user gains.",
      keywords: ["transform", "boost", "unlock", "effortless", "instant", "results", "proven", "discover", "upgrade", "designed for", "enjoy", "experience"],
      recommendation: "Focus on the end benefit for the reader rather than just product features.",
      impactWeight: 9,
    },
    {
      id: "social_proof",
      category: "Credibility & Social Proof",
      title: "Customer Rating / Social Proof",
      description: "Leverages review ratings, user counts, or expert endorsements.",
      keywords: ["trusted by", "rated", "reviews", "stars", "customers", "loved by", "certified", "award", "top-rated", "community"],
      recommendation: "Include a social proof snippet (e.g., 'Rated 4.9/5 by 10,000+ happy customers').",
      impactWeight: 7,
    },
    {
      id: "action_clarity",
      category: "Call To Action",
      title: "Clear & Frictionless Next Step",
      description: "Directs reader clearly on what action to take next.",
      keywords: ["shop", "claim", "get", "start", "try", "download", "access", "explore", "join", "order"],
      recommendation: "Use a clear, action-verb primary CTA button (e.g., 'Claim Your Discount').",
      impactWeight: 10,
    },
  ];

  const valueProps: ValuePropCheck[] = VALUE_PROP_CATEGORIES.map((cat) => {
    const matchedTerms: string[] = [];
    let excerptFound: string | undefined = undefined;

    cat.keywords.forEach((kw) => {
      if (searchCopyLower.includes(kw.toLowerCase())) {
        if (!matchedTerms.includes(kw)) {
          matchedTerms.push(kw);
        }
      }
    });

    const detected = matchedTerms.length > 0;

    if (detected) {
      // Find a snippet containing one of the matched terms
      const term = matchedTerms[0];
      const idx = searchCopyLower.indexOf(term);
      if (idx !== -1) {
        const start = Math.max(0, idx - 20);
        const end = Math.min(fullCopyCombined.length, idx + term.length + 30);
        excerptFound = "..." + fullCopyCombined.substring(start, end) + "...";
      }
    }

    return {
      id: cat.id,
      category: cat.category,
      title: cat.title,
      description: cat.description,
      detected,
      matchedTerms,
      excerptFound,
      recommendation: cat.recommendation,
      impactWeight: cat.impactWeight,
    };
  });

  const detectedValuePropCount = valueProps.filter((v) => v.detected).length;
  const totalValuePropCategories = valueProps.length;

  // 4. Calculate Scores
  // Readability score (0-100)
  const readScore = readability.readingEase;

  // Length score (0-100)
  const optimalCount = componentCounts.filter((c) => c.status === "optimal").length;
  const lengthScore = Math.round((optimalCount / componentCounts.length) * 100);

  // Value Prop score (0-100)
  const valuePropScore = Math.round((detectedValuePropCount / totalValuePropCategories) * 100);

  // Weighted Overall Score
  const overallScore = Math.min(100, Math.max(0, Math.round(readScore * 0.35 + lengthScore * 0.35 + valuePropScore * 0.30)));

  let gradeLetter: ContentAuditReport["gradeLetter"] = "B";
  if (overallScore >= 92) gradeLetter = "A+";
  else if (overallScore >= 83) gradeLetter = "A";
  else if (overallScore >= 72) gradeLetter = "B";
  else if (overallScore >= 60) gradeLetter = "C";
  else gradeLetter = "D";

  // 5. Strengths & Improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (readability.readingEase >= 65) {
    strengths.push(`High Readability: Flesch Ease score of ${readability.readingEase}/100 (${readability.label}).`);
  } else {
    improvements.push(`Simplify Copy Density: Reading Ease is ${readability.readingEase}/100. Break down long sentences.`);
  }

  if (subjStatus === "optimal") {
    strengths.push(`Subject Line Length (${subjLen} chars) fits mobile inbox preview limits.`);
  } else {
    improvements.push(`Adjust Subject Line (${subjLen} chars): ${subjFeedback}`);
  }

  if (prevStatus === "optimal") {
    strengths.push(`Preheader preview text (${prevLen} chars) is well structured.`);
  } else {
    improvements.push(`Preheader text (${prevLen} chars): ${prevFeedback}`);
  }

  if (detectedValuePropCount >= 4) {
    strengths.push(`Strong Value Prop Coverage: Detected ${detectedValuePropCount}/${totalValuePropCategories} key conversion triggers.`);
  } else {
    improvements.push(`Incorporate more value propositions (currently ${detectedValuePropCount}/${totalValuePropCategories}).`);
  }

  valueProps.filter((v) => !v.detected).forEach((v) => {
    improvements.push(`Missing ${v.category}: ${v.recommendation}`);
  });

  return {
    overallScore,
    gradeLetter,
    readability,
    estimatedReadTimeSeconds,
    totalCharsWithSpaces,
    totalCharsNoSpaces,
    componentCounts,
    valueProps,
    detectedValuePropCount,
    totalValuePropCategories,
    strengths,
    improvements,
  };
}
