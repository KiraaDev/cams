import LoginForm from "@/components/login-form";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type AppRole = "user" | "admin";

type CustomJWTPayload = {
  user_role?: AppRole;
};

export default async function LoginPage() {
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

  return <LoginForm />;
}