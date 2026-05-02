import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import { fetchInvoices } from "../../features/invoices/invoiceSlice";
import DashboardWidgets from "../shared/DashboardWidgets";
import SectionHeader from "../../components/common/SectionHeader";
import PageWrapper from "../../components/animations/PageWrapper";

function StoreDashboard() {
  const dispatch = useDispatch();
  const { items: orders } = useSelector((state) => state.orders);
  const { items: invoices } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Store" title="Purchase and delivery overview" description="Follow orders from checkout through invoice and supplier fulfillment." />
      <DashboardWidgets
        stats={[
          { title: "Orders", value: orders.length, subtitle: "Placed purchases" },
          { title: "Paid", value: orders.filter((order) => order.paymentStatus === "Paid").length, subtitle: "Successful transactions" },
          { title: "In transit", value: orders.filter((order) => order.status === "Shipped").length, subtitle: "Awaiting delivery" },
          { title: "Invoices", value: invoices.length, subtitle: "Downloadable records" },
        ]}
      />
    </PageWrapper>
  );
}

export default StoreDashboard;
