import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BadgeCheck, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import { useAuth } from "../context/AuthContext";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || "");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      toast.success("Email verified. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    setLoading(true);
    try {
      const response = await resendOtp({ email });
      setDevOtp(response.data.devOtp || "");
      toast.success("A fresh OTP was sent");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft">
        <p className="text-sm font-semibold text-teal-700">Email verification</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Enter OTP</h1>
        {devOtp ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Development OTP: {devOtp}
          </p>
        ) : null}
        <form onSubmit={submitHandler} className="mt-7 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input
            label="6-digit OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            required
          />
          <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
            <BadgeCheck size={18} />
            {loading ? "Verifying..." : "Verify account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={resendHandler}
          className="mt-5 flex items-center gap-2 text-sm font-medium text-teal-700"
          disabled={loading}
        >
          <RefreshCcw size={16} />
          Resend OTP
        </button>
        <p className="mt-5 text-sm text-slate-600">
          <Link className="font-medium text-teal-700" to="/login">
            Back to login
          </Link>
        </p>
      </section>
    </PageWrapper>
  );
}

export default VerifyOtp;
