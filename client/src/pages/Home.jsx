import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import omniStockLogo from "../assets/images/OmniStockFlow-logo.png";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  CreditCard,
  FileText,
  LogIn,
  Mail,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Store,
  UserPlus,
  Warehouse,
} from "lucide-react";

const menuItems = [
  { label: "About", key: "about", icon: Sparkles, type: "panel" },
  { label: "Features", key: "features", icon: PackageCheck, type: "panel" },
  { label: "Contact", key: "contact", icon: Mail, type: "panel" },
  { label: "Sign in", to: "/login", icon: LogIn, type: "route" },
  { label: "Sign up", to: "/register", icon: UserPlus, type: "route" },
];

const stats = [
  { label: "Role dashboards", value: "4" },
  { label: "Stock workflows", value: "12+" },
  { label: "Secure access", value: "JWT" },
];

const solutions = [
  {
    icon: PackageSearch,
    title: "Live Stock Tracking",
    description:
      "Track product availability, stock levels, and item movement across stores and warehouses.",
  },
  {
    icon: Warehouse,
    title: "Warehouse Flow",
    description:
      "Handle stock updates, product dispatch, incoming items, and warehouse-to-store transfers.",
  },
  {
    icon: Store,
    title: "Store Owner Orders",
    description:
      "Store owners can browse products, place orders, track status, and view purchase history.",
  },
  {
    icon: CreditCard,
    title: "Razorpay Payments",
    description:
      "Secure online payment flow with transaction details and payment status records.",
  },
  {
    icon: FileText,
    title: "Auto Invoices",
    description:
      "Generate invoice records after successful orders and keep them available for users.",
  },
  {
    icon: AlertTriangle,
    title: "Low Stock Alerts",
    description:
      "Get alerts when product stock goes below the required quantity.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

const panelMotion = {
  initial: { opacity: 0, y: -12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

function OmniStockLogo({ compact = false }) {
  return (
    <div
      className={
        compact
          ? "flex items-center"
          : "flex h-14 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white/80"
      }
    >
      <img
        src={omniStockLogo}
        alt="OmniStock Flow"
        className={
          compact
            ? "h-20 w-auto object-contain sm:h-24"
            : "h-24 max-w-none scale-125 object-contain"
        }
      />
    </div>
  );
}

function PanelContent({ activePanel }) {
  if (activePanel === "features") {
    return (
      <div>
        <div className="flex flex-col gap-2 text-center">
          <p className="font-bold text-teal-700">Core Features</p>
          <h2 className="text-3xl font-black text-slate-950">
            Everything your stock flow needs
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-[#fbfefd] p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Icon size={22} />
              </div>
              <h3 className="font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activePanel === "contact") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-bold text-teal-700">Contact</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Get in Touch
          </h2>
          <p className="mt-3 text-slate-600">
            Need help or have questions about OmniStock Flow?
          </p>
        </div>
        <form className="mt-8 grid gap-5 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            className="rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 md:col-span-2"
          />
          <button
            type="submit"
            className="rounded-2xl bg-teal-600 py-4 font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 md:col-span-2"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-bold text-teal-700">About OmniStock Flow</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Simple inventory flow for daily work
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          OmniStock Flow helps teams manage stock, orders, warehouses, and
          deliveries from one clean workspace.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Warehouse,
            title: "Organize stock",
            description:
              "Keep product quantities, warehouse updates, and low-stock checks easy to follow.",
          },
          {
            icon: PackageCheck,
            title: "Handle orders",
            description:
              "Move orders from request to payment, invoice, and delivery without extra confusion.",
          },
          {
            icon: ShieldCheck,
            title: "Support roles",
            description:
              "Give admins, store owners, warehouse managers, and suppliers the right access.",
          },
        ].map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-200 bg-[#fbfefd] p-5 text-left shadow-sm"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Icon size={22} />
            </div>
            <h3 className="font-black text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const [activePanel, setActivePanel] = useState("about");

  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950 selection:bg-teal-200">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" aria-label="OmniStock Flow home">
            <OmniStockLogo />
          </Link>

          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700 hover:shadow-md"
            >
              Menu
              <ChevronDown
                size={16}
                className="transition group-hover:rotate-180"
              />
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-72 translate-y-2 rounded-3xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl shadow-slate-900/15 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {menuItems.map(({ label, key, to, icon: Icon, type }) =>
                type === "route" ? (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon size={18} />
                    </span>
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActivePanel(key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${
                      activePanel === key
                        ? "bg-teal-50 text-teal-800"
                        : "text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon size={18} />
                    </span>
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-teal-700"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Sign up <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative overflow-hidden bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_45%,#fff7ed_100%)] px-4 py-14 sm:px-6 lg:py-20">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,#f7faf9)]" />

        <div className="relative mx-auto max-w-6xl">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-700 shadow-sm">
              <Sparkles size={16} />
              Smart Inventory Solution
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[1.02] text-slate-950 md:text-7xl">
              Smart Inventory and Order Platform
            </h1>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3 font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
              >
                Start now <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => setActivePanel("features")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-7 py-3 font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700"
              >
                Explore features
              </button>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm"
                >
                  <p className="text-2xl font-black text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <AnimatePresence mode="wait">
            <motion.section
              key={activePanel}
              {...panelMotion}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-12 rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-8"
            >
              <PanelContent activePanel={activePanel} />
            </motion.section>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <span>
            © {new Date().getFullYear()} OmniStock Flow. All rights reserved.
          </span>
          <div className="flex gap-2">
            {["about", "features", "contact"].map((panel) => (
              <button
                key={panel}
                type="button"
                onClick={() => setActivePanel(panel)}
                className="rounded-full px-3 py-1.5 capitalize transition hover:bg-white/10 hover:text-white"
              >
                {panel}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
