import { useEffect, useState } from "react";
import reportService from "../../services/reportService";
import DashboardWidgets from "../shared/DashboardWidgets";
import InventoryChart from "../shared/InventoryChart";
import SectionHeader from "../../components/common/SectionHeader";

function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportService.getDashboard().then((response) => setReport(response.data.data));
  }, []);

  const totals = report?.totals || {};

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Analytics" title="Admin reports" description="Revenue, utilization, and low-stock risk in a single reporting surface." />
      <DashboardWidgets
        stats={[
          { title: "Revenue", value: totals.revenue || 0, subtitle: "Captured payments" },
          { title: "Invoices", value: totals.invoices || 0, subtitle: "Generated documents" },
          { title: "Transfers", value: totals.transfers || 0, subtitle: "Movement records" },
          { title: "Pending", value: report?.pendingDeliveries || 0, subtitle: "Open deliveries" },
        ]}
      />
      <InventoryChart data={report?.lowStockProducts || []} />
    </div>
  );
}

export default Reports;
