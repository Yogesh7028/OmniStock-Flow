import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../features/invoices/invoiceSlice";
import EntityTablePage from "../shared/EntityTablePage";
import Button from "../../components/common/Button";
import { downloadInvoice } from "../../utils/downloadInvoice";

function MyInvoices() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Store"
      title="My invoices"
      description="Download payment-backed invoices generated after checkout."
      columns={[
        { key: "invoiceNumber", label: "Invoice" },
        { key: "customerName", label: "Customer" },
        { key: "totalAmount", label: "Total" },
        {
          key: "download",
          label: "Download",
          render: (row) => (
            <Button variant="secondary" onClick={() => downloadInvoice(row._id, row.invoiceNumber)}>
              PDF
            </Button>
          ),
        },
      ]}
      data={items}
    />
  );
}

export default MyInvoices;
