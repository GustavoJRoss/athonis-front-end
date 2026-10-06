import { AppShell } from "@/components/layout";
import { requireUser } from "@/lib/auth/authorization";
import { getCompany } from "@/lib/api/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  // O nome vem do cadastro da empresa. Se ainda não existir, o shell usa o
  // padrão — a tela de Configurações explica como cadastrar.
  let companyName: string | undefined;
  try {
    const company = await getCompany();
    companyName = company.tradeName || company.corporateName;
  } catch {
    companyName = undefined;
  }

  return (
    <AppShell userName={user.name} userEmail={user.email} companyName={companyName}>
      {children}
    </AppShell>
  );
}
