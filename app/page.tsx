import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 transition-colors">
      {/* Top Header/Nav */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-base">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            CAMS
          </span>
        </div>
        <div>
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            Sign In &rarr;
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto py-12">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Centralized Digital Platform
        </span>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
          Empowering Communities with Transparent Assistance
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
          Welcome to the Community Assistance Management System (CAMS). Access
          real-time support programs, manage application transparently, and
          track distributions efficiently.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/auth/login"
            className="flex h-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-semibold px-6 shadow-sm shadow-indigo-600/10 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all sm:w-44"
          >
            Access Portal
          </Link>
          <a
            href="#features"
            className="flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 font-semibold px-6 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-850 transition-all sm:w-44"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full text-center py-6 text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900">
        &copy; {new Date().getFullYear()} CAMS Platform. All rights reserved.
      </footer>
    </div>
  );
}
