export type OrderType = {
  order_id: number;
  client_id: number;
  title: string;
  description: string;
  invoice_number: string;
  urgency: string;
  vehicle_id: number;
  driver_id: number;
  quantity: number;
  delivery_street: string;
  delivery_district: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zipcode: string;
  delivery_number: string;
  delivery_complement: string;
};
