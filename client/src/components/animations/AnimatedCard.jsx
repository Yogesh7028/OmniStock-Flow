import { motion } from "framer-motion";
import { hoverLift, scaleIn } from "./motionPresets";

function AnimatedCard({ children, className = "", whileHover = hoverLift.whileHover }) {
  return (
    <motion.div
      initial={scaleIn.initial}
      animate={scaleIn.animate}
      exit={scaleIn.exit}
      transition={scaleIn.transition}
      whileHover={whileHover}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;
