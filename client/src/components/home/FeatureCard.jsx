import { motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon size={23} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </motion.article>
  );
}

export default FeatureCard;
