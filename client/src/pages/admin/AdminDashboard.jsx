import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Building2,
  CreditCard,
  IndianRupee,
  Package,
  ReceiptText,
  Store,
  Users,
  Warehouse,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import Skeleton from "../../components/common/Skeleton";
import Table from "../../components/common/Table";
import reportService from "../../services/reportService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const statusColors = ["#0f766e", "#f59e0b", "#2563eb", "#7c3aed", "#ea580c", "#16a34a"];

const safeArray = (value) => (Array.isArray(value) ? value : []);

function MetricCard({ title, value, subtitle, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "from-teal-700 to-emerald-700 text-teal-50",
    amber: "from-amber-400 to-orange-400 text-slate-950",
    slate: "from-slate-900 to-slate-700 text-white",
    blue: "from-blue-700 to-cyan-600 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="glass-panel overflow-hidden rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="h-72">{children}</div>
    </motion.section>
  );
}

function TablePanel({ title, subtitle, columns, data }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Table columns={columns} data={data} />
    </section>
  );
}

function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await reportService.getDashboard();
        if (mounted) setReport(response.data?.data || {});
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load dashboard report");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadReport();
    return () => {
      mounted = false;
    };
  }, []);

  const totals = report?.totals || {};
  const charts = report?.charts || {};
  const lowStockProducts = safeArray(report?.lowStockProducts).slice(0, 5);

  const metrics = useMemo(
    () => [
      { title: "Total Users", value: totals.users || 0, subtitle: "Across all roles", icon: Users, tone: "teal" },
      { title: "Total Products", value: totals.products || 0, subtitle: "Active catalog items", icon: Package, tone: "blue" },
      { title: "Total Warehouses", value: totals.warehouses || 0, subtitle: "Inventory locations", icon: Warehouse, tone: "slate" },
      { title: "Total Stores", value: totals.stores || 0, subtitle: "Retail touchpoints", icon: Store, tone: "teal" },
      { title: "Total Orders", value: totals.orders || 0, subtitle: "All-time order volume", icon: ReceiptText, tone: "blue" },
      { title: "Total Revenue", value: formatCurrency(totals.revenue), subtitle: "Captured payments", icon: IndianRupee, tone: "amber" },
      { title: "Pending Payments", value: totals.pendingPayments || 0, subtitle: formatCurrency(totals.pendingPaymentAmount), icon: CreditCard, tone: "slate" },
      { title: "Low Stock Alerts", value: totals.lowStockAlerts || 0, subtitle: "Products below threshold", icon: AlertTriangle, tone: "amber" },
    ],
    [totals]
  );

  if (loading) {
    return (
      <PageWrapper className="space-y-6">
        <SectionHeader eyebrow="Admin" title="Admin Dashboard" description="Loading operations intelligence." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-36" />)}
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper className="space-y-6">
        <SectionHeader eyebrow="Admin" title="Admin Dashboard" description="Operations intelligence could not be loaded." />
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-amber-300 to-cyan-400" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Admin</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Admin Dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Cards, charts, and operational tables for users, inventory, orders, payments, and revenue.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
            <Boxes size={18} />
            Live report
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Monthly Revenue" subtitle="Captured payment revenue over the last six months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={safeArray(charts.monthlyRevenue)}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Orders by Status" subtitle="Current distribution across fulfillment stages">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={safeArray(charts.ordersByStatus)} dataKey="count" nameKey="status" innerRadius={58} outerRadius={96} paddingAngle={3}>
                {safeArray(charts.ordersByStatus).map((entry, index) => (
                  <Cell key={entry.status} fill={statusColors[index % statusColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Stock Movement" subtitle="Transferred inventory quantity over the last six months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeArray(charts.stockMovement)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantity" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Top Selling Products" subtitle="Highest quantity sold across recorded orders">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeArray(charts.topSellingProducts)} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#2563eb" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TablePanel
          title="Recent Orders"
          subtitle="Latest order activity across stores"
          data={safeArray(report?.recentOrders)}
          columns={[
            { key: "_id", label: "Order", render: (row) => String(row._id).slice(-6).toUpperCase() },
            { key: "storeManager", label: "Customer", render: (row) => row.storeManager?.name || row.storeManager?.email || "-" },
            { key: "status", label: "Status" },
            { key: "totalAmount", label: "Total", render: (row) => formatCurrency(row.totalAmount) },
          ]}
        />
        <TablePanel
          title="Recent Payments"
          subtitle="Newest payment attempts and captures"
          data={safeArray(report?.recentPayments)}
          columns={[
            { key: "_id", label: "Payment", render: (row) => String(row._id).slice(-6).toUpperCase() },
            { key: "user", label: "User", render: (row) => row.user?.name || row.user?.email || "-" },
            { key: "status", label: "Status" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
          ]}
        />
        <TablePanel
          title="Low Stock Products"
          subtitle="Items needing replenishment attention"
          data={lowStockProducts}
          columns={[
            { key: "name", label: "Product" },
            { key: "sku", label: "SKU" },
            { key: "stock", label: "Stock", render: (row) => Number(row.warehouseStock || 0) + Number(row.storeStock || 0) },
            { key: "lowStockThreshold", label: "Limit" },
          ]}
        />
        <TablePanel
          title="Recent Users"
          subtitle="Newest registered users and roles"
          data={safeArray(report?.recentUsers)}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "createdAt", label: "Joined", render: (row) => formatDate(row.createdAt) },
          ]}
        />
      </div>
    </PageWrapper>
  );
}

export default AdminDashboard;
