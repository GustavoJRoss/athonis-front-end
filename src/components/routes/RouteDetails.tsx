"use client";

import {
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Timeline,
} from "antd";
import { GoogleMap } from "./googleMaps/GoogleMap";
import { RouteMap } from "./googleMaps/RouteMap";

export default async function RouteDetails({ routeInfo }: { routeInfo: any }) {
  const routes = routeInfo?.optimization_result?.routes || [];

  const getTotalDistance = () => {
    let totalKm = 0;

    routeInfo?.optimization_result?.routes?.map((r: any) => {
      totalKm += r?.totalDistance;
    });
    return (totalKm / 100000).toFixed(2);
  };

  const getTotalTime = () => {
    let totalTime = 0;

    routeInfo?.optimization_result?.routes?.map((r: any) => {
      totalTime += r?.totalDuration;
    });
    return (totalTime / 60).toFixed(2);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Pedidos"
              value={routeInfo.total_orders}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Distância Total"
              value={getTotalDistance()}
              suffix="km"
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Duração Total"
              value={getTotalTime()}
              suffix="min"
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Motorista" value={routes[0]?.driverName} />
          </Card>
        </Col>
      </Row>
      {routes?.map((routeItem: any, index: number) => (
        <>
          <RouteMap route={routeItem} height={450} />
          <Tabs
            items={[
              {
                key: "stops",
                label: "Paradas",
                children: (
                  <Card>
                    <Timeline
                      items={routeItem.stops.map((stop: any) => ({
                        label: stop.estimatedArrivalTime,
                        children: (
                          <>
                            <p>
                              <b>{stop.clientName}</b>
                            </p>
                            <p>{stop.address}</p>

                            <Space>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                                target="_blank"
                              >
                                Google Maps
                              </a>
                              <a
                                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${stop.coordinates.latitude},${stop.coordinates.longitude}`}
                                target="_blank"
                              >
                                Street View
                              </a>
                            </Space>
                          </>
                        ),
                      }))}
                    />
                  </Card>
                ),
              },
              {
                key: "driver",
                label: "Motorista & Veículo",
                children: (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Motorista">
                      {routeItem.driverName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Veículo">
                      {routeItem.vehicleName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Origem">
                      {routeItem.startLocation.latitude},{" "}
                      {routeItem.startLocation.longitude}
                    </Descriptions.Item>
                    <Descriptions.Item label="Destino">
                      {routeItem.endLocation.latitude},{" "}
                      {routeItem.endLocation.longitude}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "orders",
                label: "Pedidos",
                children: (
                  <Table
                    dataSource={routeItem.stops}
                    rowKey="orderId"
                    pagination={false}
                    columns={[
                      {
                        title: "Pedido",
                        dataIndex: "orderId",
                      },
                      {
                        title: "Cliente",
                        dataIndex: "clientName",
                      },
                      {
                        title: "Endereço",
                        dataIndex: "address",
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        </>
      ))}
    </>
  );
}
