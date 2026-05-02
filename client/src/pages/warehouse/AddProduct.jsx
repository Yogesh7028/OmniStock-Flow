import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createProduct } from "../../features/products/productSlice";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SectionHeader from "../../components/common/SectionHeader";

function AddProduct() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    generalStock: "",
    lowStockThreshold: 10,
    image: null,
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") payload.append(key, value);
    });
    const result = await dispatch(createProduct(payload));
    if (!createProduct.fulfilled.match(result)) {
      toast.error(result.error?.message || "Unable to create product");
      return;
    }

    toast.success("Product created");
    setForm({
      name: "",
      sku: "",
      brand: "",
      category: "",
      description: "",
      price: "",
      generalStock: "",
      lowStockThreshold: 10,
      image: null,
    });
    event.target.reset();
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Inventory" title="Add product" description="Register catalog inventory into general stock before transferring it to a warehouse." />
      <form onSubmit={submitHandler} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-600">Price</span>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white/90 pr-4 focus-within:border-teal-600">
            <input
              className="w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <span className="text-sm font-semibold text-slate-500">INR</span>
          </div>
        </label>
        <Input label="General Stock" type="number" value={form.generalStock} onChange={(e) => setForm({ ...form, generalStock: e.target.value })} required />
        <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
        <Input label="Product Image" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
        <div className="md:col-span-2">
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
