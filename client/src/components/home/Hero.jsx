import { ArrowRight, BarChart3, CheckCircle2, PackageCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const floatingItems = [
  ["Revenue", "₹8.4L", "bg-teal-600"],
  ["Orders", "1,284", "bg-amber-500"],
  ["Stock Sync", "99.8%", "bg-slate-900"],
];

function Hero({ onGetStarted }) {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.2),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_54%,#134e4a_100%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-100 backdrop-blur">
            <ShieldCheck size={16} />
            Enterprise-ready MERN inventory platform
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Smart Inventory & Order Management System
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Run products, warehouses, suppliers, store purchases, Razorpay payments, and invoices
            from one role-aware operations console built for fast-moving teams.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
            >
              Get Started
              <ArrowRight size={17} />
            </button>
            <a
              href="#analytics"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              View Demo
              <BarChart3 size={17} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-200">Live Ops</p>
                  <h2 className="mt-1 text-xl font-bold">Inventory Command</h2>
                </div>
                <PackageCheck className="text-amber-300" size={30} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {floatingItems.map(([label, value, color], index) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
                    transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <span className={`mb-3 block h-2 w-10 rounded-full ${color}`} />
                    <p className="text-xs text-slate-300">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.7fr]">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="font-semibold">Warehouse Stock</span>
                    <span className="text-teal-200">Healthy</span>
                  </div>
                  {[82, 64, 91, 56, 74].map((width, index) => (
                    <div key={width} className="mb-3 h-3 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + index * 0.08 }}
                        className="h-3 rounded-full bg-teal-400"
                      />
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  {["Paid invoices", "Supplier assigned", "Stock alerts"].map((item) => (
                    <div key={item} className="mb-3 flex items-center gap-2 text-sm text-slate-200 last:mb-0">
                      <CheckCircle2 size={16} className="text-amber-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
