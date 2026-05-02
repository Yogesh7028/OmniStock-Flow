import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, CreditCard, PackageCheck, Search, Truck } from "lucide-react";
import { fetchOrders } from "../../features/orders/orderSlice";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const orderSteps = [
  { label: "Pending", icon: Clock3, helper: "Order received" },
  { label: "Packed", icon: PackageCheck, helper: "Supplier packing" },
  { label: "Dispatched", icon: Truck, helper: "In transit" },
  { label: "Delivered", icon: CheckCircle2, helper: "Completed" },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-sky-50 text-sky-700 border-sky-200",
  Packed: "bg-sky-50 text-sky-700 border-sky-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Dispatched: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function TrackOrder() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.orders);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const metrics = useMemo(
    () =>
      orderSteps.map((step) => ({
        ...step,
        count: items.filter((order) => order.status === step.label).length,
      })),
    [items]
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const searchable = [
        order._id,
        order.status,
        order.paymentStatus,
        order.store?.name,
        order.supplier?.name,
        ...(order.items || []).map((item) => item.productName),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [items, query, statusFilter]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Store" title="Order tracking" description="Monitor supplier progress, payments, shipment status, and delivery readiness in one place." />

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{metric.count}</p>
                </div>
                <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-panel flex flex-col gap-3 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 lg:min-w-80">
          <Search size={18} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search order, product, supplier..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...orderSteps.map((step) => step.label)].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === status ? "bg-teal-700 text-white shadow-soft" : "bg-white/80 text-slate-600 hover:bg-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {loading &&
          [1, 2, 3].map((item) => (
            <div key={item} className="glass-panel h-52 animate-pulse rounded-3xl bg-white/60" />
          ))}

        {!loading && filteredOrders.length === 0 && (
          <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-500">
            No orders match the selected filters.
          </div>
        )}

        {filteredOrders.map((order, orderIndex) => {
          const activeIndex = Math.max(orderSteps.findIndex((step) => step.label === order.status), 0);
          const paid = order.paymentStatus === "Paid";
          return (
            <motion.article
              key={order._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIndex * 0.04 }}
              className="glass-panel overflow-hidden rounded-3xl"
            >
              <div className="border-b border-white/70 bg-white/45 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">#{order._id.slice(-8).toUpperCase()}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${paid ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                        <CreditCard size={14} />
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Ordered {formatDate(order.createdAt)} • Store {order.store?.name || "Not assigned"} • Supplier {order.supplier?.name || "Not assigned"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-5 py-3 text-right text-white">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Total</p>
                    <p className="text-2xl font-semibold">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="grid gap-3 md:grid-cols-4">
                    {orderSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isComplete = index <= activeIndex;
                      const isCurrent = index === activeIndex;
                      return (
                        <motion.div
                          key={step.label}
                          whileHover={{ y: -3 }}
                          className={`relative rounded-3xl border p-4 ${
                            isComplete ? "border-teal-200 bg-teal-50/80 text-teal-800" : "border-slate-200 bg-white/70 text-slate-400"
                          }`}
                        >
                          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${isComplete ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-400"}`}>
                            <Icon size={19} />
                          </div>
                          <p className="text-sm font-semibold">{step.label}</p>
                          <p className="mt-1 text-xs">{isCurrent ? "Current stage" : step.helper}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {(order.items || []).map((item) => (
                    <div key={`${order._id}-${item.productName}`} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white/70 p-3">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.productName} className="h-16 w-16 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <PackageCheck size={22} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{item.productName}</p>
                        <p className="text-sm text-slate-500">
                          Qty {item.quantity} • {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </PageWrapper>
  );
}

export default TrackOrder;
