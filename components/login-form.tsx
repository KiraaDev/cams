"use client";

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

    console.log(data);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      const jwt = jwtDecode<CustomJWTPayload>(data.session.access_token);

      if (!jwt.user_role) {
        setError("User Role Error");
        return;
      }

      const role: AppRole = jwt.user_role;

      if (role === "user") {
        router.replace("/user/home");
      } else if (role === "admin") {
        router.replace("admin/dashboard");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center g-zinc-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl p-8 shadow"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

        {error && <div className="mb-4 rounded  p-3 text-red-600">{error}</div>}

        <div className="mb-4">
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-3 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
