import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { createClient } from "@/lib/supabase/server";
import { AppRole, CustomJWTPayload } from "@/types/user";
import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
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

  const role: AppRole | undefined = jwt.user_role;

  if (role !== "admin") {
    if (role === "staff") {
      redirect("/staff/dashboard");
    }

    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
