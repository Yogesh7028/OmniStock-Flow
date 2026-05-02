function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="text-xs uppercase tracking-[0.35em] text-teal-700">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold">{title}</h2>
      {description && <p className="max-w-3xl text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export default SectionHeader;
