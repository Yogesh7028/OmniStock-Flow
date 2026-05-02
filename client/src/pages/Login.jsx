import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import { roleHome, useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await login(form);
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || roleHome[user.role] || "/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft">
        <p className="text-sm font-semibold text-teal-700">OmniStock Flow</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Sign in</h1>
        <form onSubmit={submitHandler} className="mt-7 space-y-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-6 flex justify-between text-sm text-slate-600">
          <Link className="font-medium text-teal-700" to="/register">
            Create account
          </Link>
          <Link className="font-medium text-teal-700" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Login;
