import { AppShell } from "@/components/layout";
import { requireUser } from "@/lib/auth/authorization";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <AppShell userName={user.name} userEmail={user.email}>
      {children}
    </AppShell>
  );
}
