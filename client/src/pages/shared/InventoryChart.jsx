import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function InventoryChart({ data }) {
  const [view, setView] = useState("Stock");
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        totalStock: Number(item.warehouseStock || 0) + Number(item.storeStock || 0),
      })),
    [data]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel rounded-3xl p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold">Inventory overview</h3>
        <div className="flex gap-2 rounded-2xl bg-white/70 p-1">
          {["Stock", "Movement"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${view === item ? "bg-teal-700 text-white" : "text-slate-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          {view === "Stock" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="warehouseStock" fill="#0f766e" radius={[8, 8, 0, 0]} animationDuration={900} />
              <Bar dataKey="storeStock" fill="#f59e0b" radius={[8, 8, 0, 0]} animationDuration={900} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalStock" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} animationDuration={900} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default InventoryChart;
