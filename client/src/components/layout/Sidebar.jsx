import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { smoothSidebar } from "../animations/motionPresets";

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

  return (
    <motion.aside
      initial={smoothSidebar.initial}
      animate={smoothSidebar.animate}
      transition={smoothSidebar.transition}
      className="glass-panel w-full rounded-3xl p-6 lg:w-72"
    >
      <div className="mb-8">
        <h1 className="mt-2 text-2xl font-semibold">OmniStock Flow</h1>
      </div>
      <nav className="space-y-2">
        {links.map(([label, href]) => (
          <motion.div key={href} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {label}
          </NavLink>
          </motion.div>
        ))}
        <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-amber-500 text-slate-950" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            Notifications
          </NavLink>
        </motion.div>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;
