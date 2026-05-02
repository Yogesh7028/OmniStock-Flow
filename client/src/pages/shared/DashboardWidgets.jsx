import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";
import { staggerChildren } from "../../components/animations/motionPresets";

function DashboardWidgets({ stats = [], loading = false }) {
  return (
    <motion.div
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {loading
        ? [1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-32" />)
        : stats.map((item) => (
        <Card key={item.title} title={item.title} value={item.value} subtitle={item.subtitle} />
      ))}
    </motion.div>
  );
}

export default DashboardWidgets;
