function DashboardHero({ eyebrow, title = "Dashboard", description }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-amber-300 to-cyan-400" />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHero;
