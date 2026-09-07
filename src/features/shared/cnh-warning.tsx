"use client";

import { AlertTriangle } from "lucide-react";
import { Box, Icon, Inline, Stack, Text } from "@/components/ui/primitives";
import { VEHICLE_TYPE_LABEL } from "@/constants/domain";
import { categoriaMinima, podeDirigir, validadeCnh, validadeCnhLabel } from "@/lib/utils/cnh";
import type { Driver, VehicleType } from "@/types/domain";

export type CnhWarningProps = {
  driver?: Driver | null;
  vehicleType?: VehicleType | null;
};

/**
 * Aviso ao escalar motorista e veículo incompatíveis.
 *
 * É aviso e não bloqueio de propósito: categoria e validade são opcionais no
 * cadastro, então o silêncio pode significar "não pode dirigir" ou apenas
 * "ninguém preencheu ainda". Bloquear pelo segundo caso pararia a operação
 * por falta de dado, não por irregularidade.
 */
export function CnhWarning({ driver, vehicleType }: CnhWarningProps) {
  if (!driver) return null;

  const avisos: string[] = [];

  const validade = validadeCnh(driver.cnhExpiration);
  const avisoValidade = validadeCnhLabel(validade);
  if (avisoValidade) {
    avisos.push(
      validade.estado === "vencida"
        ? `${avisoValidade}: o motorista não pode rodar.`
        : `${avisoValidade}.`,
    );
  }

  if (vehicleType && driver.cnhCategory && !podeDirigir(driver.cnhCategory, vehicleType)) {
    avisos.push(
      `CNH categoria ${driver.cnhCategory} não habilita ${VEHICLE_TYPE_LABEL[
        vehicleType
      ].toLowerCase()} — é exigida a categoria ${categoriaMinima(vehicleType)}.`,
    );
  }

  if (avisos.length === 0) return null;

  const grave = validade.estado === "vencida" || avisos.length > 1;

  return (
    <Box
      className={
        grave
          ? "rounded-md border border-danger/40 bg-danger/10 p-3"
          : "rounded-md border border-warning/40 bg-warning/10 p-3"
      }
    >
      <Inline gap={2} align="start">
        <Icon
          icon={AlertTriangle}
          size="sm"
          className={grave ? "mt-0.5 text-danger" : "mt-0.5 text-warning"}
        />
        <Stack gap={1}>
          {avisos.map((aviso) => (
            <Text key={aviso} size="caption">
              {aviso}
            </Text>
          ))}
        </Stack>
      </Inline>
    </Box>
  );
}
