import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../features/invoices/invoiceSlice";
import EntityTablePage from "../shared/EntityTablePage";
import Button from "../../components/common/Button";
import { downloadInvoice } from "../../utils/downloadInvoice";

function ManageInvoices() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Admin"
      title="Invoices"
      description="Payment-backed invoices are generated automatically after order capture."
      columns={[
        { key: "invoiceNumber", label: "Invoice" },
        { key: "customerName", label: "Customer" },
        { key: "paymentStatus", label: "Payment" },
        { key: "totalAmount", label: "Total" },
        {
          key: "download",
          label: "PDF",
          render: (row) => (
            <Button variant="secondary" onClick={() => downloadInvoice(row._id, row.invoiceNumber)}>
              Download
            </Button>
          ),
        },
      ]}
      data={items}
    />
  );
}

export default ManageInvoices;
