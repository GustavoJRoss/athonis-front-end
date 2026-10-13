"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils/cn";

/**
 * Mapa de acompanhamento, sobre o mapa de ruas do OpenStreetMap.
 *
 * Diferente do `RouteMap` (um esquema em SVG, sem ruas), este serve para
 * responder "por onde ele passou?": só com as ruas por baixo dá para ver se
 * o trajeto seguiu a rota ou se o veículo parou onde não devia.
 *
 * As cores vêm dos tokens do Design System e são lidas do tema ativo a cada
 * desenho, porque o Leaflet pinta em SVG fora do alcance das classes.
 */

export type TrackMapStop = {
  id: string;
  lat: number;
  lng: number;
  /** Posição na ordem planejada. */
  sequence: number | null;
  label: string;
  state: "open" | "delivered" | "failed";
  /** Linha extra do balão: horário, motivo, observação. */
  detail?: string;
};

export type TrackMapVehicle = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  detail?: string;
  selected?: boolean;
};

export type TrackMapProps = {
  stops?: TrackMapStop[];
  /** Trajeto percorrido, na ordem das leituras. */
  path?: Array<{ lat: number; lng: number }>;
  /** Paradas fora de entrega. */
  idleStops?: Array<{ lat: number; lng: number; durationMin: number; detail?: string }>;
  vehicles?: TrackMapVehicle[];
  depot?: { lat: number; lng: number } | null;
  /** Muda quando o conteúdo é de outra rota: só então o mapa reenquadra. */
  fitKey?: string;
  onVehicleClick?: (id: string) => void;
  className?: string;
};

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Centro usado enquanto não há nenhum ponto a mostrar (Jaraguá do Sul). */
const FALLBACK_CENTER: [number, number] = [-26.4851, -49.0669];

function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

export function TrackMap({
  stops = [],
  path = [],
  idleStops = [],
  vehicles = [],
  depot = null,
  fitKey,
  onVehicleClick,
  className,
}: TrackMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const fitted = useRef<string | undefined>(undefined);
  /** Último enquadramento pedido, para refazê-lo quando o contêiner ganhar tamanho. */
  const bounds = useRef<[number, number][] | null>(null);
  // Guardado em ref para que trocar a função de clique não redesenhe o mapa.
  const clickHandler = useRef(onVehicleClick);
  useEffect(() => {
    clickHandler.current = onVehicleClick;
  }, [onVehicleClick]);

  useEffect(() => {
    let cancelled = false;

    // O Leaflet usa `window` ao ser carregado; importá-lo aqui o mantém fora
    // da renderização no servidor.
    void import("leaflet").then((L) => {
      if (cancelled || !container.current) return;

      if (!map.current) {
        map.current = L.map(container.current, { zoomControl: true, attributionControl: true });
        map.current.setView(FALLBACK_CENTER, 12);
        L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map.current);
        layer.current = L.layerGroup().addTo(map.current);
      }

      const group = layer.current as LayerGroup;
      group.clearLayers();

      const color = {
        primary: token("--primary", "#2f5de3"),
        success: token("--success", "#17845a"),
        danger: token("--danger", "#dc2626"),
        warning: token("--warning", "#d97706"),
        muted: token("--muted", "#6b7280"),
        surface: token("--surface", "#ffffff"),
      };

      const balloon = (title: string, detail?: string) =>
        `<strong>${escapeHtml(title)}</strong>${detail ? `<br/>${escapeHtml(detail)}` : ""}`;

      // Rota planejada: do depósito, pelas paradas na ordem prevista. Tracejada
      // e discreta, para o trajeto real se destacar por cima dela.
      const planned = [...stops]
        .filter((stop) => stop.sequence != null)
        .sort((a, b) => (a.sequence as number) - (b.sequence as number))
        .map((stop) => [stop.lat, stop.lng] as [number, number]);
      if (planned.length > 0) {
        const line = depot ? [[depot.lat, depot.lng] as [number, number], ...planned] : planned;
        L.polyline(line, { color: color.muted, weight: 2, dashArray: "6 8", opacity: 0.9 }).addTo(group);
      }

      if (path.length > 1) {
        const points = path.map((point) => [point.lat, point.lng] as [number, number]);
        // Contorno claro por baixo: mantém a linha legível sobre ruas da mesma cor.
        L.polyline(points, { color: color.surface, weight: 7, opacity: 0.9 }).addTo(group);
        L.polyline(points, { color: color.primary, weight: 4, opacity: 1 }).addTo(group);
      }

      if (depot) {
        L.marker([depot.lat, depot.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:22px;height:22px;border-radius:4px;background:${color.muted};border:2px solid ${color.surface};display:flex;align-items:center;justify-content:center;color:${color.surface};font:700 11px system-ui">D</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        })
          .bindPopup(balloon("Depósito", "Ponto de partida da rota planejada"))
          .addTo(group);
      }

      for (const idle of idleStops) {
        L.marker([idle.lat, idle.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:26px;height:26px;border-radius:50%;background:${color.warning};border:2px solid ${color.surface};display:flex;align-items:center;justify-content:center;color:#1c1300;font:700 14px system-ui">!</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        })
          .bindPopup(balloon(`Parado por ${idle.durationMin} min`, idle.detail ?? "Fora de uma parada de entrega"))
          .addTo(group);
      }

      for (const stop of stops) {
        const fill =
          stop.state === "delivered" ? color.success : stop.state === "failed" ? color.danger : color.primary;
        // A situação não depende só da cor: o balão a diz por extenso e a
        // parada não entregue leva um "×" no lugar do número.
        const mark = stop.state === "failed" ? "×" : String(stop.sequence ?? "•");
        L.marker([stop.lat, stop.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:28px;height:28px;border-radius:50%;background:${fill};border:2px solid ${color.surface};display:flex;align-items:center;justify-content:center;color:${color.surface};font:700 13px system-ui">${mark}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        })
          .bindPopup(
            balloon(
              `${stop.sequence != null ? `${stop.sequence}. ` : ""}${stop.label}`,
              [
                stop.state === "delivered" ? "Entregue" : stop.state === "failed" ? "Não entregue" : "Em aberto",
                stop.detail,
              ]
                .filter(Boolean)
                .join(" · "),
            ),
          )
          .addTo(group);
      }

      for (const vehicle of vehicles) {
        const size = vehicle.selected ? 22 : 16;
        const marker = L.marker([vehicle.lat, vehicle.lng], {
          zIndexOffset: 1000,
          icon: L.divIcon({
            className: "",
            html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color.primary};border:3px solid ${color.surface};box-shadow:0 0 0 2px ${color.primary}"></div>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
        })
          .bindTooltip(vehicle.label, { permanent: true, direction: "top", offset: [0, -10] })
          .bindPopup(balloon(vehicle.label, vehicle.detail));
        marker.on("click", () => clickHandler.current?.(vehicle.id));
        marker.addTo(group);
      }

      // Reenquadra só quando o conteúdo muda de rota; numa atualização
      // periódica o mapa fica onde o usuário o deixou.
      const key = fitKey ?? "";
      if (fitted.current !== key) {
        const all: [number, number][] = [
          ...stops.map((stop) => [stop.lat, stop.lng] as [number, number]),
          ...path.map((point) => [point.lat, point.lng] as [number, number]),
          ...vehicles.map((vehicle) => [vehicle.lat, vehicle.lng] as [number, number]),
          ...(depot ? [[depot.lat, depot.lng] as [number, number]] : []),
        ];
        if (all.length > 0) {
          bounds.current = all;
          map.current.invalidateSize();
          map.current.fitBounds(L.latLngBounds(all), { padding: [32, 32], maxZoom: 16 });
          fitted.current = key;
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [stops, path, idleStops, vehicles, depot, fitKey]);

  // Dentro de uma aba ou de um dialog o contêiner nasce sem tamanho e só o
  // ganha quando fica visível. O Leaflet não percebe sozinho: sem avisá-lo, o
  // mapa desenha um canto só e enquadra errado.
  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      if (!map.current || element.clientWidth === 0 || element.clientHeight === 0) return;
      map.current.invalidateSize();
      if (bounds.current) {
        void import("leaflet").then((L) => {
          if (!map.current || !bounds.current) return;
          map.current.fitBounds(L.latLngBounds(bounds.current), { padding: [32, 32], maxZoom: 16 });
        });
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      map.current?.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  return (
    <div
      ref={container}
      role="application"
      aria-label="Mapa com as paradas e o trajeto percorrido"
      // z-0 cria um contexto próprio: os painéis do Leaflet usam z-index alto
      // e, sem isto, passariam por cima de menus e dialogs da aplicação.
      className={cn("border-border relative z-0 h-full w-full overflow-hidden rounded-lg border", className)}
    />
  );
}
