function Input({ label, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none ring-0 transition focus:border-teal-600 ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
