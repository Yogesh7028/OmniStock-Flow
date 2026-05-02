import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { fetchStockHistory } from "../../features/stock/stockSlice";
import DashboardWidgets from "../shared/DashboardWidgets";
import SectionHeader from "../../components/common/SectionHeader";
import PageWrapper from "../../components/animations/PageWrapper";

function WarehouseDashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { history } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchStockHistory());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Warehouse" title="Stock command center" description="See active transfer volume, warehouse depth, and low-stock pressure." />
      <DashboardWidgets
        stats={[
          {
            title: "Warehouse stock",
            value: products.reduce((sum, item) => sum + (item.warehouseStock || 0), 0),
            subtitle: "Units in warehouse",
          },
          { title: "Transfers", value: history.length, subtitle: "Movement records" },
          {
            title: "Low stock",
            value: products.filter((item) => item.warehouseStock <= item.lowStockThreshold).length,
            subtitle: "Products at risk",
          },
          { title: "Incoming", value: history.filter((item) => item.type === "WAREHOUSE_TO_WAREHOUSE").length, subtitle: "Inter-warehouse" },
        ]}
      />
    </PageWrapper>
  );
}

export default WarehouseDashboard;
