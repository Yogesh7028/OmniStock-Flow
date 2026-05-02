import { useEffect, useState } from "react";
import reportService from "../../services/reportService";
import DashboardWidgets from "../shared/DashboardWidgets";
import InventoryChart from "../shared/InventoryChart";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import Table from "../../components/common/Table";

function WarehouseReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportService.getDashboard().then((response) => setReport(response.data.data));
  }, []);

  const totals = report?.totals || {};
  const warehouseStockReport = report?.warehouseStockReport || [];

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Warehouse" title="Warehouse reports" description="Stock, transfer, and low-stock reporting for warehouse operations." />
      <DashboardWidgets
        stats={[
          { title: "Transfers", value: totals.transfers || 0, subtitle: "Movement records" },
          { title: "Low stock", value: report?.lowStockProducts?.length || 0, subtitle: "Needs response" },
          { title: "Warehouse stock", value: totals.warehouseStock || 0, subtitle: "Units left" },
          { title: "Pending", value: report?.pendingDeliveries || 0, subtitle: "Open deliveries" },
        ]}
      />
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Stock left"
          title="Stock by warehouse"
          description="Check remaining product quantities across every warehouse."
        />
        <Table
          columns={[
            { key: "name", label: "Warehouse" },
            { key: "code", label: "Code" },
            { key: "location", label: "Location" },
            { key: "manager", label: "Manager", render: (warehouse) => warehouse.manager?.name || warehouse.manager?.email || "-" },
            { key: "totalStock", label: "Total Left", render: (warehouse) => `${warehouse.totalStock || 0} units` },
            {
              key: "stock",
              label: "Product Stock",
              render: (warehouse) => {
                const stockItems = (warehouse.stock || []).filter((item) => Number(item.quantity || 0) > 0);

                if (!stockItems.length) {
                  return <span className="text-slate-400">No stock</span>;
                }

                return (
                  <div className="min-w-64 space-y-2">
                    {stockItems.map((item) => (
                      <div
                        key={item.product?._id || item.product || item._id}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{item.product?.name || "Unknown product"}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            item.product?.lowStockThreshold !== undefined &&
                            Number(item.quantity || 0) <= Number(item.product.lowStockThreshold || 0)
                              ? "bg-amber-50 text-amber-700"
                              : "bg-teal-50 text-teal-700"
                          }`}
                        >
                          {item.quantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            { key: "lowStockItems", label: "Low Stock", render: (warehouse) => warehouse.lowStockItems || 0 },
          ]}
          data={warehouseStockReport}
        />
      </section>
      <InventoryChart data={report?.lowStockProducts || []} />
    </PageWrapper>
  );
}

export default WarehouseReports;
