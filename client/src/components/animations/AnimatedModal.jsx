import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "./motionPresets";

function AnimatedModal({ open, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          exit={fadeIn.exit}
          transition={fadeIn.transition}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        >
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={scaleIn.transition}
            className="w-full"
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default AnimatedModal;
