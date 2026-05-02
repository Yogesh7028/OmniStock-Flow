import { Link } from "react-router-dom";
import { Boxes, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { roleHome, useAuth } from "../../context/AuthContext";

const navLinks = [
  ["Home", "#home"],
  ["Features", "#features"],
  ["Dashboard", "/dashboard"],
  ["Contact", "#contact"],
];

function HomeNavbar({ onAuthMode }) {
  const { user } = useAuth();
  const dashboardPath = user ? roleHome[user.role] || "/dashboard" : "/login";

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <Boxes size={21} />
          </span>
          <span className="text-lg font-bold">OmniStock Flow</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map(([label, href]) =>
            href === "/dashboard" ? (
              <Link key={label} to={dashboardPath} className="transition hover:text-teal-700">
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className="transition hover:text-teal-700">
                {label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAuthMode("login")}
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:flex"
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            type="button"
            onClick={() => onAuthMode("signup")}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <UserPlus size={16} />
            Signup
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default HomeNavbar;
