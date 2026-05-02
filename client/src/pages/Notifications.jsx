import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationRead } from "../features/notifications/notificationSlice";
import PageWrapper from "../components/animations/PageWrapper";
import Button from "../components/common/Button";
import SectionHeader from "../components/common/SectionHeader";

function Notifications() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Alerts" title="Notifications" description="Database-backed alerts for orders, payments, invoices, and delivery status." />
      <div className="space-y-4">
        {items.map((notification) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            className="glass-panel rounded-3xl p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
              </div>
              {!notification.read && (
                <Button variant="secondary" onClick={() => dispatch(markNotificationRead(notification._id))}>
                  Mark as read
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default Notifications;
