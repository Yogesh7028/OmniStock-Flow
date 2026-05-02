import { motion } from "framer-motion";
import { slideUp } from "./motionPresets";

function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      initial={slideUp.initial}
      animate={slideUp.animate}
      exit={slideUp.exit}
      transition={slideUp.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
