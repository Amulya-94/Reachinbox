import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4">
      <main className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-600">
          ReachInbox Scheduler
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
          The ultimate AI-driven cold outreach email scheduler. <br />
          Planned, persistent, and powered by BullMQ.
        </p>

        <div className="flex gap-6 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </main>

      <footer className="mt-20 text-gray-500">
        <p>Assignment for ReachInbox</p>
      </footer>
    </div>
  );
}
