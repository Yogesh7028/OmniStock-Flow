import AnimatedCard from "../animations/AnimatedCard";
import CountUp from "react-countup";

function Card({ title, value, subtitle }) {
  const numericValue = Number(value);
  const shouldCount = Number.isFinite(numericValue);

  return (
    <AnimatedCard className="glass-panel rounded-3xl bg-gradient-to-br from-white/90 to-teal-50/70 p-5" whileHover={{ y: -5, scale: 1.015 }}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
        {String(title).toLowerCase().includes("low") && Number(value) > 0 && (
          <span className="animate-pulse rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
            Alert
          </span>
        )}
      </div>
      <h3 className="mt-3 text-3xl font-semibold text-slate-900">
        {shouldCount ? <CountUp end={numericValue} duration={0.85} separator="," /> : value}
      </h3>
      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </AnimatedCard>
  );
}

export default Card;
