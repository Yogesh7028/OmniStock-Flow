import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClipboardList,
  PackageCheck,
  PackageOpen,
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
import { fetchOrders } from "../../features/orders/orderSlice";
import DashboardHero from "../../components/common/DashboardHero";
import DashboardMetricCard from "../../components/common/DashboardMetricCard";
import DashboardPanel from "../../components/common/DashboardPanel";
import PageWrapper from "../../components/animations/PageWrapper";
import Table from "../../components/common/Table";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const statusColors = ["#0f766e", "#f59e0b", "#2563eb", "#7c3aed", "#16a34a", "#ea580c"];

function SupplierDashboard() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const pendingOrders = items.filter((item) => item.status === "Pending");
  const processingOrders = items.filter((item) => item.status === "Processing");
  const shippedOrders = items.filter((item) => item.status === "Shipped");
  const deliveredOrders = items.filter((item) => item.status === "Delivered");

  const statusData = useMemo(() => {
    const counts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [items]);

  const valueByStatus = useMemo(() => {
    const totals = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + (item.totalAmount || 0);
      return acc;
    }, {});
    return Object.entries(totals).map(([status, value]) => ({ status, value }));
  }, [items]);

  const recentOrders = [...items]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <PageWrapper className="space-y-8">
      <DashboardHero
        title="Dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard title="New Orders" value={pendingOrders.length} subtitle="Awaiting action" icon={ClipboardList} tone="teal" />
        <DashboardMetricCard title="Processing" value={processingOrders.length} subtitle="In progress" icon={PackageOpen} tone="blue" />
        <DashboardMetricCard title="Shipped" value={shippedOrders.length} subtitle="In transit" icon={Truck} tone="slate" />
        <DashboardMetricCard title="Delivered" value={deliveredOrders.length} subtitle="Completed" icon={PackageCheck} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel title="Orders by Status" subtitle="Current fulfillment workload">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={58} outerRadius={96} paddingAngle={3}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.status} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Order Value by Status" subtitle="Value grouped by fulfillment stage">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel title="Recent Supplier Orders" subtitle="Latest assigned order activity">
        <Table
          columns={[
            { key: "createdAt", label: "Date", render: (order) => formatDate(order.createdAt) },
            { key: "items", label: "Items", render: (order) => order.items?.length || 0 },
            { key: "status", label: "Status" },
            { key: "paymentStatus", label: "Payment" },
            { key: "totalAmount", label: "Total", render: (order) => formatCurrency(order.totalAmount) },
          ]}
          data={recentOrders}
        />
      </DashboardPanel>
    </PageWrapper>
  );
}

export default SupplierDashboard;
