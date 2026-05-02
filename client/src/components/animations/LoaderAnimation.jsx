import { motion } from "framer-motion";

function LoaderAnimation() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center">
      <motion.span
        className="absolute inline-flex h-5 w-5 rounded-full border-2 border-teal-200"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="inline-flex h-3 w-3 rounded-full bg-teal-700"
        animate={{ scale: [1, 0.75, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default LoaderAnimation;
