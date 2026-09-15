import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthHeader } from "@/features/auth/auth-header";
import { LoginScreen } from "@/features/auth/login-screen";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <AuthHeader />
      <LoginScreen>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </LoginScreen>
    </div>
  );
}
