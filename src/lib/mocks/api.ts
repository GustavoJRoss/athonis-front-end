import { createMockResource } from "./resource";
import { customers as customersSeed } from "./customers";
import { drivers as driversSeed } from "./drivers";
import { vehicles as vehiclesSeed } from "./vehicles";
import { orders as ordersSeed } from "./orders";
import { routes as routesSeed } from "./routes";

export const customersApi = createMockResource(customersSeed, "CLI");
export const driversApi = createMockResource(driversSeed, "MOT");
export const vehiclesApi = createMockResource(vehiclesSeed, "VEI");
export const ordersApi = createMockResource(ordersSeed, "PED");
export const routesApi = createMockResource(routesSeed, "ROT");
