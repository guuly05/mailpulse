import React, { useState } from "react";
import { EmailCampaign } from "../types";
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Zap,
  MousePointerClick,
  Mail,
  HelpCircle,
  Sliders,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CampaignPerformanceProps {
  campaign: EmailCampaign;
}

export const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({
  campaign,
}) => {
  const [listSize, setListSize] = useState<number>(10000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(45);
  const [activeMetricTab, setActiveMetricTab] = useState<"timeline" | "benchmarks" | "funnel">("timeline");

  // Derive base predicted rates from campaign data
  const selectedSubject = campaign.subjectLines[campaign.selectedSubjectIndex] || campaign.subjectLines[0];
  const subjectScore = selectedSubject?.openRateScore || 85;

  // Primary variant metrics
  const openRateA = Number((subjectScore * 0.32).toFixed(1)); // e.g. 85 -> ~27.2%
  const ctrA = Number((openRateA * 0.19).toFixed(1)); // e.g. ~5.2%
  const clickToOpenA = Number(((ctrA / openRateA) * 100).toFixed(1)); // ~19.1%
  const conversionRateA = Number((ctrA * 0.28).toFixed(1)); // ~1.5%

  // Variant B metrics if present
  const variantB = campaign.variantB;
  const selectedSubjectB = variantB?.subjectLines[variantB?.selectedSubjectIndex || 0];
  const subjectScoreB = selectedSubjectB?.openRateScore || 88;
  const openRateB = Number((subjectScoreB * 0.34).toFixed(1));
  const ctrB = Number((openRateB * 0.21).toFixed(1));
  const conversionRateB = Number((ctrB * 0.30).toFixed(1));

  // Calculations based on list size
  const totalOpensA = Math.round((listSize * openRateA) / 100);
  const totalClicksA = Math.round((listSize * ctrA) / 100);
  const totalConversionsA = Math.round((listSize * conversionRateA) / 100);
  const totalRevenueA = Math.round(totalConversionsA * avgOrderValue);

  const totalOpensB = Math.round((listSize * openRateB) / 100);
  const totalClicksB = Math.round((listSize * ctrB) / 100);
  const totalConversionsB = Math.round((listSize * conversionRateB) / 100);
  const totalRevenueB = Math.round(totalConversionsB * avgOrderValue);

  // Hourly engagement timeline data
  const engagementTimelineData = [
    { hour: "Send", opensA: 0, clicksA: 0, opensB: 0, clicksB: 0 },
    { hour: "+1h", opensA: Math.round(totalOpensA * 0.25), clicksA: Math.round(totalClicksA * 0.18), opensB: Math.round(totalOpensB * 0.28), clicksB: Math.round(totalClicksB * 0.20) },
    { hour: "+2h", opensA: Math.round(totalOpensA * 0.52), clicksA: Math.round(totalClicksA * 0.42), opensB: Math.round(totalOpensB * 0.58), clicksB: Math.round(totalClicksB * 0.48) },
    { hour: "+4h", opensA: Math.round(totalOpensA * 0.74), clicksA: Math.round(totalClicksA * 0.68), opensB: Math.round(totalOpensB * 0.78), clicksB: Math.round(totalClicksB * 0.72) },
    { hour: "+8h", opensA: Math.round(totalOpensA * 0.88), clicksA: Math.round(totalClicksA * 0.84), opensB: Math.round(totalOpensB * 0.90), clicksB: Math.round(totalClicksB * 0.88) },
    { hour: "+12h", opensA: Math.round(totalOpensA * 0.94), clicksA: Math.round(totalClicksA * 0.92), opensB: Math.round(totalOpensB * 0.95), clicksB: Math.round(totalClicksB * 0.94) },
    { hour: "+24h", opensA: totalOpensA, clicksA: totalClicksA, opensB: totalOpensB, clicksB: totalClicksB },
  ];

  // Industry Benchmarks Data
  const benchmarkData = [
    { metric: "Open Rate", Yours: openRateA, IndustryAvg: 18.2, Top10Pct: 31.5 },
    { metric: "Click Rate (CTR)", Yours: ctrA, IndustryAvg: 2.1, Top10Pct: 6.8 },
    { metric: "Click-to-Open", Yours: clickToOpenA, IndustryAvg: 11.5, Top10Pct: 22.0 },
    { metric: "Conversion Rate", Yours: conversionRateA, IndustryAvg: 0.9, Top10Pct: 2.8 },
  ];

  // Conversion Funnel Data
  const funnelData = [
    { step: "Sent Emails", count: listSize, fill: "#3b82f6" },
    { step: "Delivered (99%)", count: Math.round(listSize * 0.99), fill: "#60a5fa" },
    { step: "Opened (" + openRateA + "%)", count: totalOpensA, fill: "#818cf8" },
    { step: "Clicked (" + ctrA + "%)", count: totalClicksA, fill: "#a855f7" },
    { step: "Conversions (" + conversionRateA + "%)", count: totalConversionsA, fill: "#10b981" },
  ];

  return (
    <div id="campaign-performance-visualizer" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 text-slate-100 shadow-2xl mb-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Campaign Performance Projection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Projected Analytics & Revenue Forecast</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate campaign reach, engagement timeline, open rates, CTRs, and estimated ROI based on list size.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveMetricTab("timeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMetricTab === "timeline"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Engagement Curve
          </button>
          <button
            onClick={() => setActiveMetricTab("benchmarks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMetricTab === "benchmarks"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Industry Benchmarks
          </button>
          <button
            onClick={() => setActiveMetricTab("funnel")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMetricTab === "funnel"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Conversion Funnel
          </button>
        </div>
      </div>

      {/* Simulator Inputs Bar */}
      <div className="my-6 bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Audience List Size:</span>
            <input
              type="number"
              value={listSize}
              onChange={(e) => setListSize(Math.max(100, Number(e.target.value) || 0))}
              className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Avg. Order Value ($):</span>
            <input
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Math.max(1, Number(e.target.value) || 0))}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 italic">
          💡 Projections calculated using ML open-rate scoring & industry benchmarks.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Open Rate Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Est. Open Rate</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {openRateA}%
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+{(openRateA - 18.2).toFixed(1)}% vs benchmark</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">~{totalOpensA.toLocaleString()} estimated opens</p>
        </div>

        {/* Click Through Rate Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Est. Click Rate (CTR)</span>
            <MousePointerClick className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {ctrA}%
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+{(ctrA - 2.1).toFixed(1)}% vs benchmark</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">~{totalClicksA.toLocaleString()} total clicks</p>
        </div>

        {/* Projected Conversions */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Est. Conversions</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {totalConversionsA.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            <span>Conversion rate: </span>
            <span className="font-bold text-white">{conversionRateA}%</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Based on {avgOrderValue} $ AOV</p>
        </div>

        {/* Forecasted Revenue */}
        <div className="bg-slate-950 border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">Forecasted Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ${totalRevenueA.toLocaleString()}
          </div>
          {variantB && (
            <p className="text-[11px] text-purple-300 font-semibold mt-1">
              Variant B: ${totalRevenueB.toLocaleString()} (+{Math.round(((totalRevenueB - totalRevenueA) / totalRevenueA) * 100)}%)
            </p>
          )}
          <p className="text-[10px] text-slate-500 mt-0.5">Estimated gross revenue</p>
        </div>

      </div>

      {/* Main Charts Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
        
        {/* CHART 1: Engagement Curve over 24 Hours */}
        {activeMetricTab === "timeline" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-sm text-white">Cumulative Opens & Clicks (24-Hour Horizon)</h4>
                <p className="text-xs text-slate-400">Projected engagement velocity following email broadcast dispatch.</p>
              </div>
            </div>

            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpensA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClicksA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                    {variantB && (
                      <linearGradient id="colorOpensB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    )}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="opensA" name="Opens (Variant A)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOpensA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="clicksA" name="Clicks (Variant A)" stroke="#a855f7" fillOpacity={1} fill="url(#colorClicksA)" strokeWidth={2} />
                  {variantB && (
                    <Area type="monotone" dataKey="opensB" name="Opens (Variant B)" stroke="#10b981" fillOpacity={1} fill="url(#colorOpensB)" strokeWidth={2} strokeDasharray="4 4" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: Industry Benchmarks Comparison */}
        {activeMetricTab === "benchmarks" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-sm text-white">Campaign vs. Industry Benchmarks (%)</h4>
                <p className="text-xs text-slate-400">Comparing predicted performance against ecommerce & SaaS marketing standards.</p>
              </div>
            </div>

            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar dataKey="Yours" name="Your Campaign Projection" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="IndustryAvg" name="Industry Average" fill="#64748b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Top10Pct" name="Top 10% Performers" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: Conversion Funnel */}
        {activeMetricTab === "funnel" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-sm text-white">Full Audience Conversion Funnel</h4>
                <p className="text-xs text-slate-400">Step-by-step audience drop-off from dispatch to closed order.</p>
              </div>
            </div>

            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="step" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" name="Subscribers Count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
