import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function AnalyticsChart({ type = "line", title, labels, data, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor: color,
            backgroundColor: `${color}33`,
            borderWidth: 2,
            tension: 0.4,
            fill: type === "line",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            padding: 12,
            titleColor: "#ffffff",
            bodyColor: "#cbd5e1",
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#64748b" } },
          y: { grid: { color: "rgba(148, 163, 184, 0.16)" }, ticks: { color: "#64748b" } },
        },
      },
    });

    return () => chart.destroy();
  }, [color, data, labels, title, type]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <div className="mt-4 h-56">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default AnalyticsChart;
