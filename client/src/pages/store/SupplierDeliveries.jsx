import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import EntityTablePage from "../shared/EntityTablePage";
import { formatDate } from "../../utils/helpers";

function SupplierDeliveries() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);
  const deliveries = items.filter((order) =>
    ["Packed", "Shipped", "Dispatched", "Delivered"].includes(order.status)
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Store"
      title="Supplier deliveries"
      description="Track supplier movement for your store orders."
      columns={[
        { key: "_id", label: "Order", render: (order) => `#${order._id.slice(-8).toUpperCase()}` },
        { key: "supplier", label: "Supplier", render: (order) => order.supplier?.name || "Unassigned" },
        { key: "status", label: "Status" },
        { key: "paymentStatus", label: "Payment" },
        { key: "deliveredAt", label: "Delivered", render: (order) => (order.deliveredAt ? formatDate(order.deliveredAt) : "-") },
        { key: "createdAt", label: "Created", render: (order) => formatDate(order.createdAt) },
      ]}
      data={deliveries}
    />
  );
}

export default SupplierDeliveries;
