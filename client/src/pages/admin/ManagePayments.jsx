import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../features/payments/paymentSlice";
import EntityTablePage from "../shared/EntityTablePage";

function ManagePayments() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Admin"
      title="Payments"
      description="Review captured transactions, provider references, and linked orders."
      columns={[
        { key: "provider", label: "Provider" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount" },
        { key: "razorpayOrderId", label: "Provider Order" },
        { key: "razorpayPaymentId", label: "Payment ID" },
      ]}
      data={items}
    />
  );
}

export default ManagePayments;
