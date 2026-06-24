import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CustomJWTPayload } from "@/types/user";

export default async function UserLayout({
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

  const jwt = jwtDecode<CustomJWTPayload>(
    session.access_token
  );

  const role = jwt.user_role;

  if (role !== "user") {
    if (role === "admin") {
      redirect("/admin/dashboard");
    }

    redirect("/auth/login");
  }

  return <>{children}</>;
}   