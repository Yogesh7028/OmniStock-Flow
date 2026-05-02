import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import EntityTablePage from "../shared/EntityTablePage";

function ManageOrders() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Admin"
      title="All orders"
      description="Inspect order status, payment progress, and fulfillment details."
      columns={[
        { key: "_id", label: "Order ID" },
        { key: "status", label: "Status" },
        { key: "paymentStatus", label: "Payment" },
        { key: "totalAmount", label: "Total" },
      ]}
      data={items}
    />
  );
}

export default ManageOrders;
