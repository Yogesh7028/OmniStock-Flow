import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "STORE_MANAGER",
  isVerified: true,
};

function UserFormModal({ open, onClose, onSubmit, initialValues }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        email: initialValues.email || "",
        phone: initialValues.phone || "",
        password: "",
        role: initialValues.role || "STORE_MANAGER",
        isVerified: initialValues.isVerified ?? true,
      });
    } else {
      setForm(initialState);
    }
  }, [initialValues]);

  return (
    <Modal open={open} title={initialValues ? "Edit user" : "Create user"} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        {!initialValues && (
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        )}
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-600">Role</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="STORE_MANAGER">Customer / Store Owner</option>
            <option value="WAREHOUSE_MANAGER">WAREHOUSE_MANAGER</option>
            <option value="SUPPLIER">SUPPLIER</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
          />
          Verified account
        </label>
        <div className="flex gap-3">
          <Button type="submit">{initialValues ? "Save changes" : "Create user"}</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;
