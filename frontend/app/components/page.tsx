"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "@/lib/firebase";

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, "components"));
      setComponents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All PC Components</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {components.map((comp) => (
          <li key={comp.id} className="bg-white rounded shadow p-4 border border-gray-200">
            <div className="font-bold text-lg mb-1">{comp.name}</div>
            <div className="text-gray-600 mb-1">{comp.brand} - {comp.category}</div>
            <div className="text-gray-800 font-semibold">${comp.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 