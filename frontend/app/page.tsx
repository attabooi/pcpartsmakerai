import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl font-bold mb-6">PC Part Maker AI</h1>
      <div className="flex gap-6">
        <Link href="/components" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Components</Link>
        <Link href="/tier-list" className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">Tier List</Link>
      </div>
    </div>
  );
}
