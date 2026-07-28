export interface SubjectLine {
  text: string;
  type: 'urgency' | 'curiosity' | 'direct' | 'personalized' | string;
  openRateScore: number;
  reasoning: string;
}

export interface KeyHighlight {
  title: string;
  description: string;
  iconName: string;
}

export interface PrimaryCTA {
  text: string;
  url: string;
  secondaryNote?: string;
  buttonColor?: string;
}

export interface PromoOffer {
  badgeText?: string;
  offerTitle?: string;
  offerCode?: string;
  expirationNotice?: string;
}

export interface SecondarySection {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface FooterInfo {
  companyName: string;
  address: string;
  unsubscribeText?: string;
}

export interface SpamScoreAnalysis {
  score: number;
  grade: string;
  triggerWordsFound: string[];
  recommendations: string[];
}

export interface DeliverabilityCategory {
  title: string;
  icon?: string;
  tips: string[];
}

export interface DeliverabilityTipsData {
  summary: string;
  categories: DeliverabilityCategory[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface SendTimeRecommendation {
  industry: string;
  bestDays: string[];
  bestTimeSlots: string[];
  recommendedDateTime: string;
  engagementBoost: string;
  reasoning: string;
}

export interface CampaignVariant {
  variantName: string;
  hypothesis: string;
  subjectLines: SubjectLine[];
  selectedSubjectIndex: number;
  previewText: string;
  heroImagePrompt: string;
  heroImageUrl?: string;
  heroImageAltText?: string;
  headline: string;
  subheadline: string;
  bodyParagraphs: string[];
  keyHighlights: KeyHighlight[];
  primaryCTA: PrimaryCTA;
  promoOffer?: PromoOffer;
  secondarySection?: SecondarySection;
  spamScoreAnalysis: SpamScoreAnalysis;
}

export interface EmailCampaign {
  id: string;
  createdAt: number;
  campaignTitle: string;
  subjectLines: SubjectLine[];
  selectedSubjectIndex: number;
  previewText: string;
  heroImagePrompt: string;
  heroImageUrl?: string;
  heroImageAltText?: string;
  headline: string;
  subheadline: string;
  bodyParagraphs: string[];
  keyHighlights: KeyHighlight[];
  primaryCTA: PrimaryCTA;
  promoOffer?: PromoOffer;
  secondarySection?: SecondarySection;
  footer: FooterInfo;
  spamScoreAnalysis: SpamScoreAnalysis;
  brandName: string;
  brandLogoUrl?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  visualStyle: string;
  brandTone?: string;
  
  // A/B Split Testing Support
  variantAName?: string;
  variantB?: CampaignVariant;
  winningVariant?: 'A' | 'B';
  isSplitTesting?: boolean;

  // Send-Time Optimization
  sendTimeRecommendation?: SendTimeRecommendation;
}

export interface CampaignGenerationOptions {
  prompt: string;
  goal: string;
  audience: string;
  tone: string;
  brandName: string;
  ctaText: string;
  promoCode: string;
  visualStyle: string;
  primaryColor: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  options: CampaignGenerationOptions;
}

// Brand Asset Library Types
export interface BrandColorAsset {
  id: string;
  label: string;
  hex: string;
}

export interface BrandVoiceGuideline {
  id: string;
  title: string;
  tone: string;
  targetAudience?: string;
  keyPhrases?: string[];
  bannedWords?: string[];
  notes?: string;
}

export interface BrandBoilerplateSignature {
  id: string;
  title: string;
  senderName: string;
  companyName: string;
  address: string;
  unsubscribeText: string;
  legalDisclaimer?: string;
}

export interface BrandAssetLibraryData {
  colors: BrandColorAsset[];
  voiceGuidelines: BrandVoiceGuideline[];
  signatures: BrandBoilerplateSignature[];
}
