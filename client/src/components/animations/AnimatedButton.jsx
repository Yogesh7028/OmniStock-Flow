import { motion } from "framer-motion";
import { hoverLift, tapScale } from "./motionPresets";

function AnimatedButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={hoverLift.whileHover}
      whileTap={tapScale.whileTap}
      transition={tapScale.transition}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;
