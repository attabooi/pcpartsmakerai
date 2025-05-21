"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "@/lib/firebase";

const TIER_ORDER = ["S", "A", "B", "C", "D", "F"];

function groupByCategory(components) {
  const grouped = {};
  for (const comp of components) {
    if (!grouped[comp.category]) grouped[comp.category] = [];
    grouped[comp.category].push(comp);
  }
  return grouped;
}

export default function Page() {
  const [components, setComponents] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, "components"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComponents(data);
      const cats = Array.from(new Set(data.map(c => c.category)));
      setCategories(cats);
      if (cats.length && !category) setCategory(cats[0]);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const grouped = groupByCategory(components);
  const filtered = category ? grouped[category] || [] : [];
  filtered.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PC Component Tier List</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded border ${category === cat ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(comp => (
          <div key={comp.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-lg font-bold px-2 py-1 rounded ${comp.tier === "S" ? "bg-yellow-400" : comp.tier === "A" ? "bg-green-400" : comp.tier === "B" ? "bg-blue-300" : "bg-gray-200"}`}>{comp.tier}</span>
              <span className="text-xl font-semibold">{comp.name}</span>
            </div>
            <div className="text-gray-600 mb-1">{comp.brand}</div>
            <div className="text-gray-800 font-bold mb-1">${comp.price}</div>
            <div className="text-sm text-gray-500">Bench: {comp.bench}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 