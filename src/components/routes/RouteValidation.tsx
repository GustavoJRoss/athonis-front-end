import { useState } from "react";
import { OrderType } from "../types/orders";
import { useToast } from "@/hooks/useToast";
import { generateRoute, validateOrders } from "@/src/lib/routes/requests";
import { ListCheckIcon, MapPinnedIcon } from "lucide-react";
import { Button, Card } from "antd";

type RouteValidationProps = {
  getSelectedRows: () => OrderType[];
};

export default function RouteValidation({
  getSelectedRows,
}: RouteValidationProps) {
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any[]>([]);

  const { errorToast, successToast } = useToast();

  const handleClickValidateOrders = async () => {
    const selectedRows = getSelectedRows();
    if (!selectedRows || selectedRows.length < 1) {
      errorToast(
        "Você deve selecionar ao menos 1 pedido para otimizar a rota."
      );
      setIsValidated(false);
      return;
    }
    const orderIds: number[] = selectedRows?.map((item: OrderType) => {
      return item.order_id;
    });

    const validateResponse = await validateOrders({ orderIds });

    if (validateResponse?.success) {
      if (validateResponse?.data.canOptimize) {
        successToast(
          "Verificação concluída! Você pode criar sua rota otimizada agora!"
        );
        setIsValidated(true);
      } else {
        errorToast(
          "Verificação concluída! Infelizmente alguma das rotas não passou na validação!"
        );
        setIsValidated(false);
      }
    } else {
      errorToast("Erro para validar as rotas.");
    }

    console.log({ validateResponse });
  };

  const handleClickGenerateRoute = async () => {
    const selectedRows = getSelectedRows();
    if (!selectedRows || selectedRows.length < 1) {
      errorToast("Você deve selecionar ao menos 1 pedido para gerar a rota.");
      setIsValidated(false);
      return;
    }
    const orderIds: number[] = selectedRows?.map((item: OrderType) => {
      return item.order_id;
    });

    const validateResponse = await generateRoute({ orderIds });

    if (validateResponse?.success) {
      successToast("Rota criada com sucesso");
      setRoutes(validateResponse?.data?.routes);
    } else {
      errorToast("Erro para validar as rotas.");
    }

    console.log({ validateResponse });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end items-center gap-4">
        {isValidated && (
          <Button
            onClick={handleClickGenerateRoute}
            type="primary"
            icon={<MapPinnedIcon size={16} />}
          >
            Criar Rota Otimizada
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleClickValidateOrders}
          icon={<ListCheckIcon size={16} />}
        >
          Verificar pedidos
        </Button>
      </div>
      {routes &&
        routes.length > 0 &&
        routes.map((route) => (
          <Card key={route.vehicleId} className="shadow-sm p-4">
            <h1 className="text-xl">
              {route.vehicleName} — Motorista: {route.driverName}
            </h1>

            {route.stops.map((stop: any) => (
              <div key={stop.orderId}>
                <p>
                  <b>Cliente:</b> {stop.clientName}
                </p>
                <p>
                  <b>Endereço:</b> {stop.address}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps
                </a>
              </div>
            ))}
          </Card>
        ))}
    </div>
  );
}
