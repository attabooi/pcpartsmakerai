"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

const BRAND_COLORS = {
  Samsung: "#3B82F6",
  WesternDigital: "#F43F5E",
  default: "#94A3B8",
};

const TIER_COLORS = {
  S: "#facc15",
  A: "#a78bfa",
  B: "#60a5fa",
  C: "#34d399",
  default: "#6b7280",
};

function extractBrand(name: string): string {
  if (typeof name !== "string") return "default";
  if (name.toLowerCase().includes("samsung")) return "Samsung";
  if (name.toLowerCase().includes("western digital")) return "WesternDigital";
  return "default";
}

function safeString(val: any): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    if ("text" in val) return String(val.text);
    if ("label" in val) return String(val.label);
    return JSON.stringify(val);
  }
  return String(val ?? "Unknown");
}

function truncateModel(name: string, max = 26) {
  return name.length > max ? name.slice(0, max - 3) + "..." : name;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded px-4 py-3 text-xs text-white shadow max-w-xs">
        <p className="font-bold text-sm mb-2">{safeString(data.name)}</p>
        <ul className="space-y-0.5">
          <li><b>Brand:</b> <span style={{ color: BRAND_COLORS[data.brand] }}>{data.brand}</span></li>
          <li><b>Score:</b> {data.score}</li>
          <li><b>Tier:</b> <span style={{ color: TIER_COLORS[data.tier] }}>{data.tier}</span></li>
          <li><b>Capacity:</b> {data.capacity ?? "-"} GB</li>
          <li><b>Read Speed:</b> {data.read_speed ?? "-"} MB/s</li>
          <li><b>Write Speed:</b> {data.write_speed ?? "-"} MB/s</li>
          <li><b>Price:</b> {data.price && data.price > 0 ? `$${data.price}` : <span className="text-slate-400">가격정보 없음</span>}</li>
        </ul>
      </div>
    );
  }
  return null;
};

export default function SolidStateDriveTierGraphPage() {
  const [ssds, setSsds] = useState([]);
  const [viewMode, setViewMode] = useState("performance");

  useEffect(() => {
    const fetchData = async () => {
      const ref = collection(db, "parts/solid-state-drive/items");
      const snapshot = await getDocs(query(ref));
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSsds(results);
    };
    fetchData();
  }, []);

  const data = useMemo(() => {
    return ssds
      .filter(ssd => {
        if (viewMode === "performance") return ssd.performance_score;
        return ssd.value_score && ssd.price && ssd.price > 0;
      })
      .map(ssd => {
        const name = safeString(ssd.name);
        const score = viewMode === "performance" ? ssd.performance_score : ssd.value_score;
        const brand = ssd.brand || extractBrand(name);
        const tier = viewMode === "performance" ? ssd.performance_tier : ssd.value_tier;
        let model = name;
        let brandLabel = "";
        if (brand !== "default" && name.startsWith(brand)) {
          brandLabel = brand;
          model = name.replace(brand, "").trim();
        }
        return {
          ...ssd,
          name,
          brand,
          tier,
          score,
          brandLabel,
          modelLabel: truncateModel(model),
          price: ssd.price,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [ssds, viewMode]);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6">
      <h1 className="text-3xl font-extrabold text-center mb-1">Solid State Drive Tier Report</h1>
      <p className="text-xs text-center mt-2 text-slate-500 italic">
        {viewMode === "performance" ? (
          <>
            <span className="text-sky-400">Performance = read speed × write speed</span><br />
            Read and Write speeds determine the SSD's performance.
          </>
        ) : (
          <>
            <span className="text-purple-400">Value = performance score ÷ price</span><br />
            Value Score shows performance per dollar. SSDs with missing price are excluded.
          </>
        )}
      </p>

      <div className="flex justify-center gap-2 mt-4 mb-6">
        <button
          className={`px-4 py-1 rounded-full text-xs font-medium ${viewMode === "performance" ? "bg-sky-500 text-white" : "bg-slate-700 text-slate-300"}`}
          onClick={() => setViewMode("performance")}
        >
          Performance
        </button>
        <button
          className={`px-4 py-1 rounded-full text-xs font-medium ${viewMode === "value" ? "bg-purple-500 text-white" : "bg-slate-700 text-slate-300"}`}
          onClick={() => setViewMode("value")}
        >
          Value
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-slate-400">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 24 + 60}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 60, left: 120, bottom: 10 }}
            barSize={22}
          >
            <XAxis type="number" stroke="#CBD5E1" fontSize={12} />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              interval={0}
              tick={({ x, y, payload, index }) => {
                const d = data[index];
                return (
                  <text
                    x={x - 10}
                    y={y + 7}
                    fontSize={12}
                    fontWeight={600}
                    textAnchor="end"
                    alignmentBaseline="middle"
                  >
                    {d.brandLabel && (
                      <tspan fill={BRAND_COLORS[d.brand] || BRAND_COLORS.default}>
                        {d.brandLabel + " "}
                      </tspan>
                    )}
                    <tspan fill="#e5e7eb">{d.modelLabel}</tspan>
                  </text>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score">
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={TIER_COLORS[entry.tier] || TIER_COLORS.default} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 