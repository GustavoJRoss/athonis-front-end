"use client";

import { Label } from "@/components/ui/label";
import { Card, Input } from "antd";
import { OrderType } from "../types/orders";

export default function OrderDetails({ order }: { order: OrderType }) {
  return (
    <Card className="overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label label="Cliente ID">
          <Input type="number" value={order?.client_id} readOnly />
        </Label>

        <Label label="Título">
          <Input value={order?.title} readOnly />
        </Label>

        <Label label="Urgência">
          <Input value={order?.urgency} readOnly />
        </Label>

        <Label label="Número NF">
          <Input value={order?.invoice_number} readOnly />
        </Label>

        <Label label="Descrição" className="col-span-2">
          <Input.TextArea value={order?.description} readOnly />
        </Label>

        <Label label="Veículo">
          <Input value={order?.vehicle_id} readOnly />
        </Label>

        <Label label="Motorista">
          <Input value={order?.driver_id} readOnly />
        </Label>

        <Label label="Quantidade">
          <Input type="number" value={order?.quantity} readOnly />
        </Label>

        <Label label="Rua">
          <Input value={order?.delivery_street} readOnly />
        </Label>

        <Label label="Bairro">
          <Input value={order?.delivery_district} readOnly />
        </Label>

        <Label label="Cidade">
          <Input value={order?.delivery_city} readOnly />
        </Label>

        <Label label="Estado">
          <Input value={order?.delivery_state} readOnly />
        </Label>

        <Label label="CEP">
          <Input value={order?.delivery_zipcode} readOnly />
        </Label>

        <Label label="Número">
          <Input value={order?.delivery_number} readOnly />
        </Label>

        <Label label="Complemento">
          <Input value={order?.delivery_complement} readOnly />
        </Label>
      </div>
    </Card>
  );
}
