"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    await supabase.auth.signOut();

    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}