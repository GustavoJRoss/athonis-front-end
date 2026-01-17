// import RoutesHistoryPage from "@/src/components/routes/RoutesHistoryPage";
// import HeaderPage from "@/src/components/utils/headerPage/HeaderPage";
// import { getOrders } from "@/src/lib/orders/requests";
// import { getRoutes } from "@/src/lib/routes/requests";
// import { MapPinnedIcon } from "lucide-react";

// export default async function PageRoutesHistory() {
//   const ordersResponse = await getRoutes({
//     page: 1,
//     pageSize: 10,
//   });

//   return (
//     <>
//       <HeaderPage
//         title="Histórico de Rotas"
//         icon={MapPinnedIcon}
//         backTo={{ link: "/routes", title: "Voltar para página de rotas." }}
//       />
//       <RoutesHistoryPage
//         initialData={ordersResponse?.data?.items || []}
//         totalRows={ordersResponse?.data?.meta?.total || 0}
//       />
//     </>
//   );
// }
