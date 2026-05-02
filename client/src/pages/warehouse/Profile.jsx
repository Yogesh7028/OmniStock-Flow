import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMe } from "../../features/auth/authSlice";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import ToastMessage from "../../components/common/ToastMessage";

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setMessage("");
    const result = await dispatch(
      updateMe({
        name: form.name,
        phone: form.phone,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      })
    );
    if (!result.error) {
      setMessage("Profile updated successfully.");
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Warehouse" title="Profile" description="View your warehouse manager identity and role permissions." />
      <form onSubmit={submitHandler} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Email" value={form.email} disabled />
        <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <Input label="Role" value={form.role} disabled />
        <Input label="Current Password" type="password" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} />
        <Input label="New Password" type="password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} />
        <div className="md:col-span-2">
          <ToastMessage message={error || message} tone={error ? "error" : "success"} />
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}

export default Profile;
