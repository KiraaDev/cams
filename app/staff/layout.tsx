import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CustomJWTPayload } from "@/types/user";
import SignOutButton from "@/components/auth/sign-out-button";
import Link from "next/link";

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const jwt = jwtDecode<CustomJWTPayload>(session.access_token);

  const role = jwt.user_role;

  if (role !== "staff") {
    if (role === "admin") {
      redirect("/admin/dashboard");
    }

    redirect("/auth/login");
  }

  const staffProfile = {
    name:
      (session.user.user_metadata?.full_name as string | undefined) ||
      session.user.email ||
      "Staff User",
    role: "Social Welfare Staff",
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            C
          </div>
          <span className="text-xl font-bold">CAMS Staff</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/staff/reports"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reports
          </Link>

          <SignOutButton />

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{staffProfile.name}</p>
            <p className="text-xs text-slate-500">{staffProfile.role}</p>
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}
