import { motion } from "framer-motion";

function AnimatedTableRow({ children }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(240, 253, 250, 0.9)", x: 3 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="text-slate-700"
    >
      {children}
    </motion.tr>
  );
}

export default AnimatedTableRow;
