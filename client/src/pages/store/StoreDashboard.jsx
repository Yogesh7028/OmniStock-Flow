import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  ReceiptText,
  ShoppingCart,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { fetchInvoices } from "../../features/invoices/invoiceSlice";
import DashboardHero from "../../components/common/DashboardHero";
import DashboardMetricCard from "../../components/common/DashboardMetricCard";
import DashboardPanel from "../../components/common/DashboardPanel";
import PageWrapper from "../../components/animations/PageWrapper";
import Table from "../../components/common/Table";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const statusColors = ["#0f766e", "#f59e0b", "#2563eb", "#7c3aed", "#16a34a", "#ea580c"];

const monthLabel = (date) =>
  new Date(date).toLocaleString("en-IN", { month: "short" });

function StoreDashboard() {
  const dispatch = useDispatch();
  const { items: orders } = useSelector((state) => state.orders);
  const { items: invoices } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const inTransitOrders = orders.filter((order) => ["Shipped", "Dispatched"].includes(order.status));
  const totalSpend = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const statusData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const monthlySpend = useMemo(() => {
    const buckets = paidOrders.reduce((acc, order) => {
      const month = monthLabel(order.createdAt || order.confirmedAt || Date.now());
      acc[month] = (acc[month] || 0) + (order.totalAmount || 0);
      return acc;
    }, {});
    return Object.entries(buckets).map(([month, amount]) => ({ month, amount }));
  }, [paidOrders]);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <PageWrapper className="space-y-8">
      <DashboardHero
        title="Dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard title="Orders" value={orders.length} subtitle="Placed purchases" icon={ShoppingCart} tone="teal" />
        <DashboardMetricCard title="Paid" value={paidOrders.length} subtitle={formatCurrency(totalSpend)} icon={CreditCard} tone="amber" />
        <DashboardMetricCard title="In Transit" value={inTransitOrders.length} subtitle="Awaiting delivery" icon={Truck} tone="blue" />
        <DashboardMetricCard title="Invoices" value={invoices.length} subtitle="Downloadable records" icon={ReceiptText} tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPanel title="Order Status" subtitle="Current purchase distribution">
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

        <DashboardPanel title="Monthly Spend" subtitle="Paid order value by month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpend}>
                <defs>
                  <linearGradient id="storeSpendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={3} fill="url(#storeSpendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel title="Recent Orders" subtitle="Latest purchases and payment state">
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

export default StoreDashboard;
