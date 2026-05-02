import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import DashboardWidgets from "../shared/DashboardWidgets";
import InventoryChart from "../shared/InventoryChart";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";

function PurchaseAnalytics() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const spend = items.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const productRows = items.flatMap((order) =>
    order.items?.map((item) => ({
      name: item.productName,
      warehouseStock: item.quantity,
      storeStock: 0,
    })) || []
  );

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Store" title="Purchase analytics" description="Track order volume, spend, and product demand." />
      <DashboardWidgets
        stats={[
          { title: "Orders", value: items.length, subtitle: "Purchase history" },
          { title: "Spend", value: Math.round(spend), subtitle: "Total value" },
          { title: "Paid", value: items.filter((order) => order.paymentStatus === "Paid").length, subtitle: "Confirmed" },
          { title: "Delivered", value: items.filter((order) => order.status === "Delivered").length, subtitle: "Completed" },
        ]}
      />
      <InventoryChart data={productRows} />
    </PageWrapper>
  );
}

export default PurchaseAnalytics;
