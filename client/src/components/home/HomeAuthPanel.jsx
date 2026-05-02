import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Mail, X, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../common/Button";
import Input from "../common/Input";
import { roleHome, useAuth } from "../../context/AuthContext";

const roles = [
  { value: "STORE_MANAGER", label: "Customer / Store Owner" },
  { value: "WAREHOUSE_MANAGER", label: "Warehouse Manager" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "ADMIN", label: "Admin" },
];

const initialLoginForm = { email: "", password: "" };

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "STORE_MANAGER",
  phone: "",
  storeName: "",
};

function HomeAuthPanel({ mode, onModeChange, onClose }) {
  const navigate = useNavigate();
  const { forgotPassword, login, register } = useAuth();
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await login(loginForm);
      toast.success("Welcome back");
      navigate(roleHome[user.role] || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        phone: registerForm.phone,
        storeName: registerForm.storeName,
      });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", {
        state: {
          email: response.data.email || registerForm.email,
          devOtp: response.data.devOtp,
        },
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword({ email: forgotEmail });
      toast.success("Password reset OTP sent");
      navigate("/reset-password", {
        state: {
          email: forgotEmail,
          devOtp: response.data.devOtp,
        },
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eyebrow = isForgot ? "Password Recovery" : isSignup ? "Create Account" : "Welcome Back";
  const title = isForgot
    ? "Send reset OTP"
    : isSignup
      ? "Start with OmniStock Flow"
      : "Sign in to your dashboard";

  return (
    <AnimatePresence>
      {mode && (
        <motion.section
          initial={{ opacity: 0, height: 0, y: -18 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -18 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden border-b border-slate-200 bg-white/85 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                    {eyebrow}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  aria-label="Close authentication panel"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-5 inline-flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => onModeChange("login")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                    !isSignup && !isForgot ? "bg-white text-teal-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                    isSignup ? "bg-white text-teal-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Signup
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("forgot")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                    isForgot ? "bg-white text-teal-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Forgot
                </button>
              </div>

              {isForgot ? (
                <form onSubmit={submitForgotPassword} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Input
                    label="Email"
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    required
                  />
                  <Button className="flex h-12 items-center justify-center gap-2" disabled={loading}>
                    <Mail size={18} />
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                  <p className="text-sm text-slate-600 md:col-span-2">
                    Remembered your password?{" "}
                    <button
                      type="button"
                      onClick={() => onModeChange("login")}
                      className="font-semibold text-teal-700"
                    >
                      Back to login
                    </button>
                  </p>
                </form>
              ) : isSignup ? (
                <form onSubmit={submitRegister} className="grid gap-4 md:grid-cols-2">
                  <Input label="Name" value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} required />
                  <Input label="Email" type="email" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} required />
                  <Input label="Phone" value={registerForm.phone} onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })} required />
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-600">Role</span>
                    <select
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-teal-600"
                      value={registerForm.role}
                      onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input label="Password" type="password" value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} minLength={8} required />
                  <Input label="Confirm password" type="password" value={registerForm.confirmPassword} onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })} minLength={8} required />
                  <div className="md:col-span-2">
                    <Input label="Store name optional" value={registerForm.storeName} onChange={(event) => setRegisterForm({ ...registerForm, storeName: event.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
                      <UserPlus size={18} />
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={submitLogin} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
                  <Input label="Email" type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} required />
                  <div className="space-y-2">
                    <Input label="Password" type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} required />
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(loginForm.email);
                        onModeChange("forgot");
                      }}
                      className="text-sm font-semibold text-teal-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button className="flex h-12 items-center justify-center gap-2" disabled={loading}>
                    <LogIn size={18} />
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default HomeAuthPanel;
