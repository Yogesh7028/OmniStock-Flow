import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import EntityTablePage from "../shared/EntityTablePage";
import { formatCurrency, formatDate } from "../../utils/helpers";

function WarehouseOrders() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Warehouse"
      title="Assigned orders"
      description="Review store orders that need warehouse visibility, preparation, dispatch, or receipt."
      columns={[
        { key: "_id", label: "Order ID", render: (order) => `#${order._id.slice(-8).toUpperCase()}` },
        { key: "store", label: "Store", render: (order) => order.store?.name || "Unassigned" },
        { key: "supplier", label: "Supplier", render: (order) => order.supplier?.name || "Unassigned" },
        { key: "status", label: "Status" },
        { key: "paymentStatus", label: "Payment" },
        { key: "totalAmount", label: "Total", render: (order) => formatCurrency(order.totalAmount) },
        { key: "createdAt", label: "Created", render: (order) => formatDate(order.createdAt) },
      ]}
      data={items}
    />
  );
}

export default WarehouseOrders;
