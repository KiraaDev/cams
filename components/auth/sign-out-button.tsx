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
      className="rounded-xl border px-4 py-2 font-medium transition hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}