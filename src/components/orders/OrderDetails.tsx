"use client";

import { Label } from "@/components/ui/label";
import { Button, Card, Flex, Input } from "antd";
import { OrderType } from "../types/orders";
import { Grid } from "../ui/Grid";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { OrderDialog } from "./dialogs/OrdersDialogs";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Fieldset } from "../ui/Fieldset";

export default function OrderDetails({ order }: { order: OrderType }) {
  const router = useRouter();

  const orderDialogRef = useRef<any>(null);

  return (
    <Card className="overflow-y-auto max-h-[calc(100vh-225px)]">
      <Grid size={12}>
        <Grid.Cell span={11}>
          <Label label="Título">
            <Input value={order?.title} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={1}>
          <Flex className="h-full" align="end" justify="end" gap={"middle"}>
            <Button
              type="primary"
              className="w-full"
              icon={<EditOutlined />}
              onClick={() => orderDialogRef?.current?.open("edit", order)}
            />
            <Button
              type="primary"
              danger
              className="w-full"
              icon={<DeleteOutlined />}
            />
          </Flex>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <Label label="Descrição" className="col-span-2">
            <Input.TextArea value={order?.description} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 1, sm: 5, xs: 12 }}>
          <Label label="Cliente ID">
            <Input type="number" value={order?.client_id} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 2, sm: 5, xs: 12 }}>
          <Label label="Urgência">
            <Input value={order?.urgency} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 2 }}>
          <Label label="Número NF">
            <Input value={order?.invoice_number} readOnly />
          </Label>
        </Grid.Cell>

        <Grid.Cell span={{ lg: 2, xs: 12 }}>
          <Label label="Veículo">
            <Input value={order?.vehicle_id} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 2, xs: 12 }}>
          <Label label="Motorista">
            <Input value={order?.driver_id} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={{ lg: 2, xs: 12 }}>
          <Label label="Quantidade">
            <Input type="number" value={order?.quantity} readOnly />
          </Label>
        </Grid.Cell>
        <Grid.Cell span={12}>
          <Fieldset title="Endereço de Entrega">
            <Grid size={12}>
              <Grid.Cell span={{ lg: 6, sm: 12 }}>
                <Label label="Rua">
                  <Input value={order?.delivery_street} readOnly />
                </Label>
              </Grid.Cell>
              <Grid.Cell span={{ lg: 4 }}>
                <Label label="Bairro">
                  <Input value={order?.delivery_district} readOnly />
                </Label>
              </Grid.Cell>
              <Grid.Cell span={{ lg: 2 }}>
                <Label label="Número">
                  <Input value={order?.delivery_number} readOnly />
                </Label>
              </Grid.Cell>
              <Grid.Cell span={{ lg: 4, sm: 12 }}>
                <Label label="Cidade">
                  <Input value={order?.delivery_city} readOnly />
                </Label>
              </Grid.Cell>
              <Grid.Cell span={{ lg: 1, sm: 12 }}>
                <Label label="Estado">
                  <Input value={order?.delivery_state} readOnly />
                </Label>
              </Grid.Cell>
              <Grid.Cell span={{ lg: 3 }}>
                <Label label="CEP">
                  <Input value={order?.delivery_zipcode} readOnly />
                </Label>
              </Grid.Cell>

              <Grid.Cell span={{ lg: 4 }}>
                <Label label="Complemento">
                  <Input value={order?.delivery_complement} readOnly />
                </Label>
              </Grid.Cell>
            </Grid>
          </Fieldset>
        </Grid.Cell>
        <OrderDialog
          ref={orderDialogRef}
          onSubmitSuccess={() => router.refresh()}
        />
      </Grid>
    </Card>
  );
}
