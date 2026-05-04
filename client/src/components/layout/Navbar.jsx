import { motion } from "framer-motion";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markNotificationRead } from "../../features/notifications/notificationSlice";
import Button from "../common/Button";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function Navbar({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { items } = useSelector((state) => state.notifications);
  const [panelOpen, setPanelOpen] = useState(false);
  const unreadCount = items.filter((item) => !item.read).length;
  const roleLabel = {
    STORE_MANAGER: "Customer / Store Owner",
    WAREHOUSE_MANAGER: "Warehouse Manager",
    SUPPLIER: "Supplier",
    ADMIN: "Admin",
  }[user?.role] || user?.role;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    dispatch(fetchNotifications());
    const timer = window.setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => window.clearInterval(timer);
  }, [dispatch]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel relative flex flex-col gap-4 overflow-visible rounded-3xl p-5 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p className="text-sm font-medium text-slate-500">Signed in as</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">{user?.email}</h2>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ rotate: 10, scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="rounded-2xl border border-slate-200 bg-white/85 p-2.5 text-slate-700 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>
        <motion.button
          animate={{ rotate: [0, 12, -10, 8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 7 }}
          onClick={() => setPanelOpen((value) => !value)}
          className="relative rounded-2xl border border-slate-200 bg-white/85 p-2.5 text-slate-700 shadow-sm"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
              {unreadCount}
            </span>
          )}
        </motion.button>
        <span className="rounded-2xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-teal-700">
          {roleLabel}
        </span>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
      {panelOpen && (
        <motion.div
          initial={{ opacity: 0, x: 24, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 24 }}
          className="absolute right-4 top-24 z-30 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <span className="text-xs text-slate-500">{unreadCount} unread</span>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {items.slice(0, 6).map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => dispatch(markNotificationRead(notification._id))}
                className={`w-full rounded-2xl p-3 text-left text-sm transition hover:bg-slate-50 ${
                  notification.read ? "bg-white/50 text-slate-500" : "bg-teal-50 text-slate-800"
                }`}
              >
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-xs">{notification.message}</p>
              </button>
            ))}
            {items.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No notifications yet.</p>}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Navbar;
