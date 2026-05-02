export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export const slideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export const slideDown = {
  initial: { opacity: 0, y: -18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const hoverLift = {
  whileHover: { y: -6, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
};

export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 350, damping: 18 },
};

export const smoothSidebar = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};
