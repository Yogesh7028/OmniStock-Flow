import AnimatedButton from "../animations/AnimatedButton";

function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-teal-700 to-emerald-700 text-white hover:from-teal-800 hover:to-emerald-800",
    secondary: "border border-slate-200 bg-white/85 text-slate-800 hover:bg-white",
    warning: "bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:from-amber-300 hover:to-orange-300",
  };

  return (
    <AnimatedButton
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-soft transition after:absolute after:inset-0 after:scale-0 after:rounded-full after:bg-white/25 after:transition-transform active:after:scale-150 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
}

export default Button;
