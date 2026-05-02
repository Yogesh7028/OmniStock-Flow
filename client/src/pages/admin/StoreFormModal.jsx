import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const initialState = { name: "", code: "", location: "", manager: "" };

function StoreFormModal({ open, onClose, onSubmit, initialValues }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(
      initialValues
        ? {
            name: initialValues.name || "",
            code: initialValues.code || "",
            location: initialValues.location || "",
            manager: initialValues.manager?._id || initialValues.manager || "",
          }
        : initialState
    );
  }, [initialValues]);

  return (
    <Modal open={open} title={initialValues ? "Edit store" : "Create store"} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <Input label="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <Input label="Manager ID" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
        <div className="flex gap-3">
          <Button type="submit">{initialValues ? "Save changes" : "Create store"}</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default StoreFormModal;
