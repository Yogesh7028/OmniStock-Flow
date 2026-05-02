import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import DashboardWidgets from "../shared/DashboardWidgets";
import SectionHeader from "../../components/common/SectionHeader";
import PageWrapper from "../../components/animations/PageWrapper";

function SupplierDashboard() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Supplier" title="Fulfillment dashboard" description="See newly assigned work, shipment progress, and delivery throughput." />
      <DashboardWidgets
        loading={loading}
        stats={[
          { title: "New orders", value: items.filter((item) => item.status === "Pending").length, subtitle: "Awaiting action" },
          { title: "Processing", value: items.filter((item) => item.status === "Processing").length, subtitle: "In progress" },
          { title: "Shipped", value: items.filter((item) => item.status === "Shipped").length, subtitle: "In transit" },
          { title: "Delivered", value: items.filter((item) => item.status === "Delivered").length, subtitle: "Completed" },
        ]}
      />
    </PageWrapper>
  );
}

export default SupplierDashboard;
