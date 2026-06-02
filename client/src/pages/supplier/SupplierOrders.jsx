import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import EntityTablePage from "../shared/EntityTablePage";

function SupplierOrders() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <EntityTablePage
      title="Assigned orders"
      columns={[
        { key: "_id", label: "Order ID" },
        { key: "status", label: "Status" },
        { key: "paymentStatus", label: "Payment" },
        { key: "totalAmount", label: "Amount" },
      ]}
      data={items}
    />
  );
}

export default SupplierOrders;
