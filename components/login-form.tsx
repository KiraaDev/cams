"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AppRole, CustomJWTPayload } from "@/types/user";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      const jwt = jwtDecode<CustomJWTPayload>(data.session.access_token);

      if (!jwt.user_role) {
        setError("User Role Error");
        setLoading(false);
        return;
      }

      const role: AppRole = jwt.user_role;

      if (role === "staff") {
        router.replace("/staff/dashboard");
      } else if (role === "admin") {
        router.replace("/admin/dashboard");
      }
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0f766e_0%,#0f172a_40%,#020617_100%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="grid lg:grid-cols-2">
          <section className="flex flex-col justify-between border-b border-white/10 p-7 text-slate-100 sm:p-10 lg:border-b-0 lg:border-r">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <Image
                  src="/lgu-logo.svg"
                  alt="LGU logo"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border border-white/20 bg-white/90 p-1"
                />
                <Image
                  src="/dict-logo.svg"
                  alt="DICT logo"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border border-white/20 bg-white/90 p-1"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">
                Community Assistance
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Management System
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                Secure portal for LGU and DICT-assisted program administration.
                Manage beneficiaries, applications, and assistance release
                workflows.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-slate-800/60 p-4 text-sm text-slate-300">
              Access is restricted to authorized personnel only.
            </div>
          </section>

          <section className="p-7 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">
                Sign in to CAMS
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Enter your account credentials to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-100"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-800/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-100"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/15 bg-slate-800/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-slate-950 transition hover:from-cyan-400 hover:to-blue-400 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
