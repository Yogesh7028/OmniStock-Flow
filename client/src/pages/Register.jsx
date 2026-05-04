import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageWrapper from "../components/animations/PageWrapper";
import { useAuth } from "../context/AuthContext";

const roles = [
  { value: "STORE_MANAGER", label: "Customer / Store Owner" },
  { value: "WAREHOUSE_MANAGER", label: "Warehouse Manager" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "ADMIN", label: "Admin" },
];

const storeDetailRoles = ["STORE_MANAGER", "CUSTOMER", "STORE_OWNER"];

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STORE_MANAGER",
    phone: "",
    storeName: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const shouldShowStoreDetails = storeDetailRoles.includes(form.role);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        storeName: shouldShowStoreDetails ? form.storeName : "",
      });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", {
        state: {
          email: response.data.email || form.email,
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
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-soft">
        <p className="text-sm font-semibold text-teal-700">OmniStock Flow</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Create account</h1>
        <form onSubmit={submitHandler} className="mt-7 grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Role</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-teal-600"
              value={form.role}
              onChange={(event) => {
                const role = event.target.value;
                setForm({
                  ...form,
                  role,
                  storeName: storeDetailRoles.includes(role) ? form.storeName : "",
                });
              }}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            minLength={8}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            minLength={8}
            required
          />
          {shouldShowStoreDetails && (
            <div className="md:col-span-2">
              <Input
                label="Store name optional"
                value={form.storeName}
                onChange={(event) => setForm({ ...form, storeName: event.target.value })}
              />
            </div>
          )}
          <div className="md:col-span-2">
            <Button className="flex w-full items-center justify-center gap-2" disabled={loading}>
              <UserPlus size={18} />
              {loading ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-teal-700" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </PageWrapper>
  );
}

export default Register;
