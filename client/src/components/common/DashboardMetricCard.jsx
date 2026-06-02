import { motion } from "framer-motion";
import CountUp from "react-countup";

function DashboardMetricCard({ title, value, subtitle, icon: Icon, tone = "teal" }) {
  const numericValue = Number(value);
  const shouldCount = Number.isFinite(numericValue);
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">
            {shouldCount ? (
              <CountUp end={numericValue} duration={0.85} separator="," />
            ) : (
              value
            )}
          </h3>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
              tones[tone] || tones.teal
            }`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DashboardMetricCard;
