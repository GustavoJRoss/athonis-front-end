"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Inline, Stack, Text } from "@/components/ui/primitives";
import { toaster } from "@/components/ui/toast";
import { driverAccessApi } from "@/lib/api/resources";
import type { Driver } from "@/types/domain";

const accessKey = (driverId: string) => ["driver-access", driverId] as const;

const MIN_PASSWORD = 6;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Acesso do motorista ao aplicativo de entregas.
 *
 * O cadastro do motorista e o login são separados de propósito: nem todo
 * motorista usa o app, e desligar o acesso de alguém não apaga o histórico
 * de entregas dele.
 */
export function DriverAccessDialog({
  driver,
  onClose,
}: {
  driver: Driver | null;
  onClose: () => void;
}) {
  return (
    <DialogRoot open={!!driver} onOpenChange={(details) => !details.open && onClose()}>
      <DialogContent size="md">
        {/* Montado só com o dialog aberto, para o formulário nascer vazio a cada motorista. */}
        {driver && <AccessForm key={driver.id} driver={driver} onClose={onClose} />}
      </DialogContent>
    </DialogRoot>
  );
}

function AccessForm({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: access, isLoading, isError } = useQuery({
    queryKey: accessKey(driver.id),
    queryFn: () => driverAccessApi.get(driver.id),
  });

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Enquanto o usuário não digita, o campo mostra o e-mail já cadastrado.
  const emailValue = email ?? access?.email ?? "";
  const emailError = !EMAIL.test(emailValue.trim()) ? "Informe um e-mail válido" : undefined;
  const passwordError =
    password.length < MIN_PASSWORD ? `A senha precisa de ao menos ${MIN_PASSWORD} caracteres` : undefined;

  const refresh = () => queryClient.invalidateQueries({ queryKey: accessKey(driver.id) });

  const grant = useMutation({
    mutationFn: () =>
      driverAccessApi.grant(driver.id, { email: emailValue.trim(), password }),
    onSuccess: () => {
      void refresh();
      toaster.success({
        title: access?.hasAccess ? "Acesso atualizado" : "Acesso criado",
        description: `${driver.name} já pode entrar no aplicativo com o e-mail e a senha informados.`,
      });
      onClose();
    },
    onError: (error) =>
      toaster.error({ title: "Não foi possível salvar o acesso", description: error.message }),
  });

  const revoke = useMutation({
    mutationFn: () => driverAccessApi.revoke(driver.id),
    onSuccess: () => {
      void refresh();
      toaster.success({
        title: "Acesso desligado",
        description: `${driver.name} foi desconectado do aplicativo.`,
      });
      onClose();
    },
    onError: (error) =>
      toaster.error({ title: "Não foi possível desligar o acesso", description: error.message }),
  });

  const busy = grant.isPending || revoke.isPending;
  const ativo = !!access?.hasAccess && access.isActive;

  return (
    <DialogForm
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!emailError && !passwordError) grant.mutate();
      }}
    >
      <DialogHeader>
        <DialogTitle>Acesso ao aplicativo</DialogTitle>
        <DialogDescription>{driver.name}</DialogDescription>
      </DialogHeader>

      <DialogBody>
        <Stack gap={4}>
          <Inline gap={2} align="center">
            <Text size="body-sm" color="muted">
              Situação:
            </Text>
            {isLoading ? (
              <Text size="body-sm" color="muted">
                Consultando…
              </Text>
            ) : isError ? (
              <StatusBadge tone="danger">Não foi possível consultar</StatusBadge>
            ) : ativo ? (
              <StatusBadge tone="success">Com acesso</StatusBadge>
            ) : access?.hasAccess ? (
              <StatusBadge tone="warning">Acesso desligado</StatusBadge>
            ) : (
              <StatusBadge tone="muted">Sem acesso</StatusBadge>
            )}
          </Inline>

          {access?.lastLogin && (
            <Text size="body-sm" color="muted">
              Último login: {new Date(access.lastLogin).toLocaleString("pt-BR")}
            </Text>
          )}

          <Input
            label="E-mail de acesso"
            type="email"
            autoComplete="off"
            required
            value={emailValue}
            onChange={(event) => setEmail(event.target.value)}
            error={submitted ? emailError : undefined}
            disabled={busy}
          />
          <Input
            label={access?.hasAccess ? "Nova senha" : "Senha"}
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={submitted ? passwordError : undefined}
            description={
              access?.hasAccess
                ? "Salvar troca a senha e desconecta os aparelhos que entraram com a anterior."
                : "Informe ao motorista. Ele entra no aplicativo com este e-mail e esta senha."
            }
            disabled={busy}
          />
        </Stack>
      </DialogBody>

      <DialogFooter className={ativo ? "justify-between" : undefined}>
        {ativo && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => revoke.mutate()}
            loading={revoke.isPending}
            disabled={busy}
          >
            Desligar acesso
          </Button>
        )}
        <Inline gap={2}>
          <Button type="button" variant="tertiary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={grant.isPending} disabled={busy}>
            {access?.hasAccess ? "Salvar acesso" : "Criar acesso"}
          </Button>
        </Inline>
      </DialogFooter>
    </DialogForm>
  );
}
