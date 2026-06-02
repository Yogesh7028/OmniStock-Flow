import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowRightLeft,
  Boxes,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchProducts } from "../../features/products/productSlice";
import { fetchStockHistory } from "../../features/stock/stockSlice";
import DashboardHero from "../../components/common/DashboardHero";
import DashboardMetricCard from "../../components/common/DashboardMetricCard";
import DashboardPanel from "../../components/common/DashboardPanel";
import PageWrapper from "../../components/animations/PageWrapper";
import Table from "../../components/common/Table";
import { formatDate } from "../../utils/formatDate";

const transferColors = ["#0f766e", "#f59e0b", "#2563eb"];

function WarehouseDashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { history } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchStockHistory());
  }, [dispatch]);

  const warehouseStock = products.reduce((sum, item) => sum + (item.warehouseStock || 0), 0);
  const storeStock = products.reduce((sum, item) => sum + (item.storeStock || 0), 0);
  const generalStock = products.reduce((sum, item) => sum + (item.generalStock || 0), 0);
  const lowStockProducts = products
    .filter((item) => (item.warehouseStock || 0) <= (item.lowStockThreshold || 0))
    .slice(0, 5);

  const stockData = [
    { name: "Warehouse", value: warehouseStock },
    { name: "Store", value: storeStock },
    { name: "General", value: generalStock },
  ].filter((item) => item.value > 0);

  const transferData = useMemo(() => {
    const counts = history.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({
      type: type.replaceAll("_", " "),
      count,
    }));
  }, [history]);

  const recentTransfers = [...history]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <PageWrapper className="space-y-8">
      <DashboardHero
        title="Dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard title="Warehouse Stock" value={warehouseStock} subtitle="Units available" icon={Boxes} tone="teal" />
        <DashboardMetricCard title="Transfers" value={history.length} subtitle="Recorded movements" icon={ArrowRightLeft} tone="blue" />
        <DashboardMetricCard title="Low Stock" value={lowStockProducts.length} subtitle="Needs attention" icon={AlertTriangle} tone="amber" />
        <DashboardMetricCard title="Incoming" value={history.filter((item) => item.type === "WAREHOUSE_TO_WAREHOUSE").length} subtitle="Inter-warehouse" icon={Truck} tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel title="Stock Distribution" subtitle="General, warehouse, and store stock">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
                  {stockData.map((entry, index) => (
                    <Cell key={entry.name} fill={transferColors[index % transferColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Transfer Activity" subtitle="Movement count by transfer type">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transferData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel title="Low Stock Products" subtitle="Products at or below threshold">
          <Table
            columns={[
              { key: "name", label: "Product" },
              { key: "sku", label: "SKU" },
              { key: "warehouseStock", label: "Stock" },
              { key: "lowStockThreshold", label: "Threshold" },
            ]}
            data={lowStockProducts}
          />
        </DashboardPanel>

        <DashboardPanel title="Recent Transfers" subtitle="Latest stock movement records">
          <Table
            columns={[
              { key: "createdAt", label: "Date", render: (item) => formatDate(item.createdAt) },
              { key: "type", label: "Type", render: (item) => item.type?.replaceAll("_", " ") || "-" },
              { key: "product", label: "Product", render: (item) => item.product?.name || item.productName || "-" },
              { key: "quantity", label: "Qty" },
            ]}
            data={recentTransfers}
          />
        </DashboardPanel>
      </div>
    </PageWrapper>
  );
}

export default WarehouseDashboard;
