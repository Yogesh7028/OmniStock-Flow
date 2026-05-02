import AnimatedButton from "../animations/AnimatedButton";

function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    secondary: "bg-white/80 text-slate-800 hover:bg-white",
    warning: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  };

  return (
    <AnimatedButton
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-soft transition after:absolute after:inset-0 after:scale-0 after:rounded-full after:bg-white/25 after:transition-transform active:after:scale-150 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
}

export default Button;
