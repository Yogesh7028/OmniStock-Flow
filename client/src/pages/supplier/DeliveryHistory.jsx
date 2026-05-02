import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import EntityTablePage from "../shared/EntityTablePage";

function DeliveryHistory() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Supplier"
      title="Delivery history"
      description="Delivered and shipped order history for supplier fulfillment."
      columns={[
        { key: "_id", label: "Order ID" },
        { key: "status", label: "Status" },
        { key: "paymentStatus", label: "Payment" },
        { key: "totalAmount", label: "Amount" },
      ]}
      data={items.filter((item) => ["Shipped", "Dispatched", "Delivered"].includes(item.status))}
    />
  );
}

export default DeliveryHistory;
