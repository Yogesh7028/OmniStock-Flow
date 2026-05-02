import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      toast.success("Password reset OTP sent");
      navigate("/reset-password", {
        state: {
          email,
          devOtp: response.data.devOtp,
        },
      });
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
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Send reset OTP</h1>
        <form onSubmit={submitHandler} className="mt-7 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
            <Mail size={18} />
            {loading ? "Sending..." : "Send OTP"}
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

export default ForgotPassword;
