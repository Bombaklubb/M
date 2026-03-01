import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🗺️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sidan hittades inte</h1>
        <p className="text-gray-500 mb-6">
          Det verkar som att du har hittat en okänd del av kartan!
        </p>
        <Link
          href="/"
          className="btn-primary bg-blue-500 hover:bg-blue-600 inline-flex"
        >
          ← Tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}
