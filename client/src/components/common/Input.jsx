function Input({ label, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(13,148,136,0.12)] ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
