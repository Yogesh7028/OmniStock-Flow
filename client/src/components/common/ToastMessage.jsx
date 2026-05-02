import { AnimatePresence, motion } from "framer-motion";

function ToastMessage({ message, tone = "success" }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`rounded-3xl border px-4 py-3 text-sm shadow-soft ${tones[tone]}`}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ToastMessage;
