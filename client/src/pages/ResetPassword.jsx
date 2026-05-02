import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import { useAuth } from "../context/AuthContext";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const devOtp = location.state?.devOtp || "";

  const submitHandler = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: form.email,
        otp: form.otp,
        password: form.password,
      });
      toast.success("Password reset successful");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft">
        <p className="text-sm font-semibold text-teal-700">Password recovery</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Reset password</h1>
        {devOtp ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Development OTP: {devOtp}
          </p>
        ) : null}
        <form onSubmit={submitHandler} className="mt-7 space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input
            label="6-digit OTP"
            value={form.otp}
            onChange={(event) => setForm({ ...form, otp: event.target.value.replace(/\D/g, "").slice(0, 6) })}
            inputMode="numeric"
            maxLength={6}
            required
          />
          <Input
            label="New password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            minLength={8}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            minLength={8}
            required
          />
          <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
            <KeyRound size={18} />
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          <Link className="font-medium text-teal-700" to="/login">
            Back to login
          </Link>
        </p>
      </section>
    </PageWrapper>
  );
}

export default ResetPassword;
