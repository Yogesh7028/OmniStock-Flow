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
  LayoutDashboard,
  LockKeyhole,
  PackageCheck,
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
  { label: "Workflow", href: "#workflow" },
  { label: "Roles", href: "#roles" },
  { label: "Contact", href: "#contact" },
];

const features = [
  {
    icon: PackageSearch,
    title: "Real-time Stock Tracking",
    description: "Monitor stock movement across purchasing, warehouse handling, and delivery operations.",
  },
  {
    icon: Warehouse,
    title: "Multi-Warehouse Management",
    description: "Organize warehouse inventory, selected stock sources, and fulfillment visibility.",
  },
  {
    icon: Store,
    title: "Store Purchase Orders",
    description: "Let store teams browse products, create carts, and submit purchase orders clearly.",
  },
  {
    icon: CreditCard,
    title: "Razorpay Payment Support",
    description: "Support payment creation, verification, and invoice generation in the checkout flow.",
  },
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    description: "Give each user role focused screens for the work they are responsible for.",
  },
  {
    icon: AlertTriangle,
    title: "Low Stock Alerts",
    description: "Surface low-stock conditions so teams can respond before operations slow down.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Review operational reports without showing invented metrics or placeholder results.",
  },
];

const workflow = [
  {
    icon: Store,
    title: "Customer / Store Owner creates order",
    description: "Products are selected, quantities are reviewed, and the order is submitted.",
  },
  {
    icon: CreditCard,
    title: "Payment processed",
    description: "Payment status and invoice flow are handled through the configured payment workflow.",
  },
  {
    icon: Truck,
    title: "Supplier receives order",
    description: "Assigned suppliers can view orders and update fulfillment progress.",
  },
  {
    icon: Warehouse,
    title: "Warehouse manages delivery/stock",
    description: "Warehouse teams receive stock, manage delivery status, and keep inventory aligned.",
  },
  {
    icon: ShieldCheck,
    title: "Admin monitors system",
    description: "Admins oversee users, products, warehouses, orders, payments, and reports.",
  },
];

const roles = [
  {
    icon: ShieldCheck,
    title: "Admin",
    description: "Manages users, products, warehouses, stores, orders, payments, invoices, reports, and system settings.",
  },
  {
    icon: Store,
    title: "Customer / Store Owner",
    description: "Browses available products, creates purchase orders, completes checkout, and tracks order progress.",
  },
  {
    icon: Building2,
    title: "Warehouse Manager",
    description: "Maintains warehouse stock, handles transfers, monitors low-stock alerts, and manages deliveries.",
  },
  {
    icon: Truck,
    title: "Supplier",
    description: "Receives assigned orders, updates delivery status, and reviews fulfillment history.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const sectionProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
  variants: fadeUp,
};

function DashboardIllustration() {
  const panels = [
    { icon: Boxes, label: "Stock" },
    { icon: PackageCheck, label: "Orders" },
    { icon: Warehouse, label: "Warehouse" },
    { icon: LockKeyhole, label: "Roles" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.65 }}
      className="relative mx-auto w-full max-w-xl"
      aria-label="Dashboard-style inventory management illustration"
    >
      <div className="rounded-[2rem] border border-indigo-100 bg-white p-4 shadow-2xl shadow-indigo-200/50">
        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <Boxes size={20} />
              </div>
              <div>
                <div className="h-3 w-32 rounded-full bg-slate-300" />
                <div className="mt-2 h-2 w-20 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-indigo-300" />
              <span className="h-3 w-3 rounded-full bg-blue-300" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {panels.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-slate-200" />
                  <div className="h-2 w-2/3 rounded-full bg-blue-100" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-indigo-600" size={20} />
              <span className="text-sm font-semibold text-slate-700">Connected order workflow</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {workflow.map((step) => (
                <div key={step.title} className="h-2 rounded-full bg-indigo-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  return (
    <div id="home" className="min-h-screen bg-[#eef4ff] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-indigo-100/80 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Boxes size={21} />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-950">OmniStock Flow</span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-600 hover:text-indigo-700">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(135deg,_#eef2ff_0%,_#f8fbff_52%,_#e0f2fe_100%)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div initial="hidden" animate="visible" transition={{ duration: 0.6 }} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
                <UserRoundCog size={16} />
                Inventory, orders, payments, and delivery operations
              </div>
              <h1 className="mt-7 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Smart Inventory & Order Management System
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                OmniStock Flow helps teams manage products, warehouse stock, purchase orders, payments,
                delivery status, and role-based operations from one clean platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700"
                >
                  Get Started
                  <ArrowRight size={17} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-indigo-200 hover:text-indigo-700"
                >
                  Login
                </Link>
              </div>
            </motion.div>

            <DashboardIllustration />
          </div>
        </section>

        <motion.section id="features" className="bg-[linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] px-4 py-20 sm:px-6 lg:px-8" {...sectionProps}>
          <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-700">Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Practical tools for inventory operations
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              A focused set of workflows for managing stock, orders, payments, alerts, and reports without placeholder metrics.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <motion.article
                key={title}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm shadow-indigo-100/80 backdrop-blur"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </motion.article>
            ))}
          </div>
          </div>
        </motion.section>

        <motion.section id="workflow" className="bg-[linear-gradient(135deg,_#eef2ff_0%,_#e0f2fe_48%,_#f0fdfa_100%)] py-20" {...sectionProps}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-700">Workflow</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                A clear path from order creation to delivery
              </h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-5">
              {workflow.map(({ icon: Icon, title, description }, index) => (
                <motion.article
                  key={title}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm shadow-blue-100/70 backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                  {index < workflow.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-8 hidden text-indigo-300 lg:block" size={22} />
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="roles" className="bg-[linear-gradient(180deg,_#f0f9ff_0%,_#eef2ff_48%,_#faf5ff_100%)] px-4 py-20 sm:px-6 lg:px-8" {...sectionProps}>
          <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-700">Roles</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboards shaped around responsibilities
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {roles.map(({ icon: Icon, title, description }) => (
              <motion.article
                key={title}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm shadow-indigo-100/80 backdrop-blur"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </motion.article>
            ))}
          </div>
          </div>
        </motion.section>

        <motion.section id="contact" className="bg-[linear-gradient(135deg,_#eef2ff_0%,_#dbeafe_100%)] px-4 py-20 sm:px-6 lg:px-8" {...sectionProps}>
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-[linear-gradient(135deg,_#4338ca_0%,_#2563eb_55%,_#0891b2_100%)] px-6 py-14 text-center text-white shadow-2xl shadow-indigo-200 sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage inventory, orders, payments, and deliveries from one platform.
            </h2>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 hover:bg-blue-50"
            >
              Start Now
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-indigo-100 bg-[#f8fbff] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Boxes size={18} />
              </span>
              <span className="font-bold text-slate-950">OmniStock Flow</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">Inventory and order management for role-based teams.</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-indigo-700">
                {link.label}
              </a>
            ))}
            <Link to="/login" className="hover:text-indigo-700">
              Login
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Copyright {new Date().getFullYear()} OmniStock Flow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
