import React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      {/* Marketing Navigation header */}
      <header className="border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              CareerOS
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-450 font-semibold">
            <span className="hover:text-white cursor-pointer transition">Features</span>
            <span className="hover:text-white cursor-pointer transition">Pricing</span>
            <span className="hover:text-white cursor-pointer transition">About</span>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/sign-in"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded transition"
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition shadow-lg glow-indigo"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-650 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>&copy; {new Date().getFullYear()} CareerOS. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
