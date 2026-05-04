import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  PackageSearch,
  ShieldCheck,
  Store,
  Truck,
  UserRoundCog,
  Warehouse,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Roles", href: "#roles" },
];

const features = [
  {
    icon: PackageSearch,
    title: "Real-Time Stock Tracking",
    description:
      "Track products, stock levels, and inventory movement across stores and warehouses in real-time.",
  },
  {
    icon: Warehouse,
    title: "Multi-Warehouse Control",
    description:
      "Manage inventory across multiple warehouses and transfer stock seamlessly.",
  },
  {
    icon: Store,
    title: "Store Owner Ordering",
    description:
      "Store Owners can place orders, track status, and manage purchase history.",
  },
  {
    icon: CreditCard,
    title: "Razorpay Payments",
    description:
      "Secure online payments with Razorpay and complete transaction tracking.",
  },
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    description:
      "Different dashboards for Admin, Store Owner, Warehouse Manager, and Supplier.",
  },
  {
    icon: AlertTriangle,
    title: "Low Stock Alerts",
    description:
      "Automatic alerts when stock levels fall below threshold.",
  },
  {
    icon: FileText,
    title: "Auto Invoice Records",
    description:
      "Invoices generated automatically after order completion.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "View reports for stock, orders, and payments in one place.",
  },
];

const roles = [
  {
    icon: ShieldCheck,
    title: "Admin",
    description:
      "Manages users, products, orders, payments, reports, and system settings.",
  },
  {
    icon: Store,
    title: "Customer / Store Owner",
    description:
      "Places orders, completes payments, tracks deliveries, and views invoices.",
  },
  {
    icon: Building2,
    title: "Warehouse Manager",
    description:
      "Handles stock, transfers, dispatch, and warehouse operations.",
  },
  {
    icon: Truck,
    title: "Supplier",
    description:
      "Receives orders and manages delivery and fulfillment.",
  },
];

const securityItems = [
  "JWT Authentication",
  "OTP Verification",
  "Role-Based Access Control",
  "Secure Payment Records",
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const sectionProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
  transition: { duration: 0.5 },
  variants: fadeUp,
};

function DashboardIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="rounded-3xl border bg-white p-4 shadow-xl">
        <div className="grid grid-cols-2 gap-3">
          {["Stock", "Orders", "Warehouse", "Roles"].map((label) => (
            <div key={label} className="p-4 border rounded-xl bg-slate-50">
              <p className="text-sm font-semibold">{label}</p>
              <div className="mt-2 h-2 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="h-2 rounded-full bg-indigo-100" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  return (
    <div id="home" className="min-h-screen bg-[#eef4ff]">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b">
        <nav className="max-w-7xl mx-auto flex justify-between p-4">
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Boxes size={20} /> OmniStock Flow
          </h1>

          <div className="flex gap-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold">
          Smart Inventory & Order Management
        </h1>
        <p className="mt-4 text-gray-600">
          Manage stock, orders, payments, and suppliers in one platform.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded">
            Get Started
          </Link>
          <Link to="/login" className="border px-6 py-2 rounded">
            Login
          </Link>
        </div>

        <div className="mt-10">
          <DashboardIllustration />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center">Features</h2>

        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white p-6 rounded-xl shadow">
              <Icon />
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="text-sm mt-2 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center">Roles</h2>

        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {roles.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white p-6 rounded-xl shadow">
              <Icon />
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="text-sm mt-2 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold">Security</h2>

        <div className="grid md:grid-cols-2 gap-4 mt-6 max-w-xl mx-auto">
          {securityItems.map((item) => (
            <div key={item} className="bg-white p-4 rounded shadow flex gap-2">
              <CheckCircle2 className="text-indigo-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} OmniStock Flow
        </p>
      </footer>
    </div>
  );
}

export default Home;