import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { CustomJWTPayload } from "@/types/user";
import RegisterForm from "@/components/register-form";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const jwt = jwtDecode<CustomJWTPayload>(
      session.access_token
    );

    const role = jwt.user_role;

    if (role === "user") {
      redirect("/user/home");
    }

    if (role === "admin") {
      redirect("/admin/dashboard");
    }
  }

  return <RegisterForm />;
}