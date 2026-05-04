import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Headphones,
  History,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  User,
  Users,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { smoothSidebar } from "../animations/motionPresets";

const iconMap = {
  Dashboard: Home,
  Users,
  Products: Package,
  Warehouses: Warehouse,
  Stores: Store,
  Orders: ClipboardList,
  Payments: CreditCard,
  Invoices: FileText,
  Reports: BarChart3,
  Settings,
  Support: Headphones,
  "Manage Stock": Boxes,
  "Transfer Stock": Truck,
  "Delivery Status": Truck,
  "Low Stock Alerts": AlertTriangle,
  "Stock History": History,
  Profile: User,
  "Browse Products": Package,
  Cart: ShoppingCart,
  Checkout: CreditCard,
  "My Orders": ClipboardList,
  "Track Order": Truck,
  "Supplier Deliveries": Building2,
  Inventory: Boxes,
  Analytics: BarChart3,
  "Supplier Orders": ClipboardList,
  "Delivery History": History,
  Notifications: Bell,
};

const roleLinks = {
  ADMIN: [
    ["Dashboard", "/admin"],
    ["Users", "/admin/users"],
    ["Products", "/admin/products"],
    ["Warehouses", "/admin/warehouses"],
    ["Stores", "/admin/stores"],
    ["Orders", "/admin/orders"],
    ["Payments", "/admin/payments"],
    ["Invoices", "/admin/invoices"],
    ["Reports", "/admin/reports"],
    ["Settings", "/settings"],
    ["Support", "/support-tickets"],
  ],
  WAREHOUSE_MANAGER: [
    ["Dashboard", "/warehouse"],
    ["Warehouses", "/warehouse/warehouses"],
    ["Manage Stock", "/warehouse/manage-stock"],
    ["Transfer Stock", "/warehouse/transfer-stock"],
    ["Orders", "/warehouse/orders"],
    ["Delivery Status", "/warehouse/delivery-status"],
    ["Low Stock Alerts", "/warehouse/low-stock-alerts"],
    ["Stock History", "/warehouse/stock-history"],
    ["Invoices", "/warehouse/invoices"],
    ["Reports", "/warehouse/reports"],
    ["Profile", "/warehouse/profile"],
    ["Settings", "/settings"],
  ],
  STORE_MANAGER: [
    ["Dashboard", "/store"],
    ["Browse Products", "/store/browse-products"],
    ["Cart", "/store/cart"],
    ["Checkout", "/store/checkout"],
    ["My Orders", "/store/my-orders"],
    ["Track Order", "/store/track-order"],
    ["Supplier Deliveries", "/store/supplier-deliveries"],
    ["Invoices", "/store/invoices"],
    ["Inventory", "/store/inventory"],
    ["Analytics", "/store/analytics"],
    ["Settings", "/settings"],
    ["Support", "/support-tickets"],
  ],
  SUPPLIER: [
    ["Dashboard", "/supplier"],
    ["Supplier Orders", "/supplier/orders"],
    ["Delivery Status", "/supplier/delivery-status"],
    ["Delivery History", "/supplier/delivery-history"],
    ["Settings", "/settings"],
    ["Support", "/support-tickets"],
  ],
};

function Sidebar({ role }) {
  const links = roleLinks[role] || [];
  const roleName = role
    ? role
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Workspace";

  return (
    <motion.aside
      initial={smoothSidebar.initial}
      animate={smoothSidebar.animate}
      transition={smoothSidebar.transition}
      className="glass-panel sticky top-6 w-full overflow-hidden rounded-3xl p-4 lg:w-72"
    >
      <div className="mb-6 rounded-2xl border border-white/70 bg-white/60 p-4">
        <motion.div
          initial={{ scale: 0.92, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-amber-400 text-white shadow-soft"
        >
          <Boxes size={22} />
        </motion.div>
        <h1 className="text-2xl font-semibold text-slate-900">OmniStock Flow</h1>
        <p className="mt-1 text-xs font-medium text-slate-500">{roleName}</p>
      </div>
      <nav className="max-h-[calc(100vh-13rem)] space-y-1 overflow-y-auto pr-1">
        {links.map(([label, href]) => (
          <motion.div key={href} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-soft"
                    : "text-slate-600 hover:bg-white/75 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => {
                const Icon = iconMap[label] || Home;
                return (
                  <>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? "bg-white/15 text-amber-300" : "bg-white/80 text-teal-700 group-hover:bg-teal-50"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="ml-auto h-2 w-2 rounded-full bg-amber-300"
                      />
                    )}
                  </>
                );
              }}
            </NavLink>
          </motion.div>
        ))}
        <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive ? "bg-amber-400 text-slate-950 shadow-soft" : "text-slate-600 hover:bg-white/75 hover:text-slate-900"
              }`
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-amber-600">
              <Bell size={18} />
            </span>
            <span>Notifications</span>
          </NavLink>
        </motion.div>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;
