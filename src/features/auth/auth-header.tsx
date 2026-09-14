"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Icon, Inline, Text } from "@/components/ui/primitives";

export function AuthHeader() {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <header className="shrink-0 border-b border-border-subtle bg-surface">
      <Container width="default">
        <Inline justify="between" align="center" className="h-16">
          <Text weight="semibold" className="text-heading-4 text-foreground">
            ATHONIS
          </Text>
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <Icon icon={ArrowLeft} size="sm" />
            Voltar
          </Button>
        </Inline>
      </Container>
    </header>
  );
}
