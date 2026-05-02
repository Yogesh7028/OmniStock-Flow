import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../../features/products/productSlice";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import Table from "../../components/common/Table";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuth } from "../../context/AuthContext";

const emptyEditForm = {
  name: "",
  sku: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  generalStock: "",
  warehouseStock: "",
  storeStock: "",
  lowStockThreshold: "",
  image: null,
};

function ManageStock() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items } = useSelector((state) => state.products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [createForm, setCreateForm] = useState({ ...emptyEditForm, lowStockThreshold: 10 });
  const [editForm, setEditForm] = useState(emptyEditForm);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      sku: product.sku || "",
      brand: product.brand || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price ?? "",
      generalStock: product.generalStock ?? "",
      warehouseStock: product.warehouseStock ?? "",
      storeStock: product.storeStock ?? "",
      lowStockThreshold: product.lowStockThreshold ?? "",
      image: null,
    });
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value !== null && value !== "") payload.append(key, value);
    });
    const result = await dispatch(updateProduct({ id: editingProduct._id, payload }));
    if (updateProduct.fulfilled.match(result)) {
      toast.success("Product updated");
    } else {
      toast.error(result.error?.message || "Unable to update product");
      return;
    }
    setEditingProduct(null);
    setEditForm(emptyEditForm);
  };

  const submitCreate = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(createForm).forEach(([key, value]) => {
      if (key === "warehouseStock" || key === "storeStock") return;
      if (value !== null && value !== "") payload.append(key, value);
    });
    const result = await dispatch(createProduct(payload));
    if (createProduct.fulfilled.match(result)) {
      toast.success("Product created in general stock");
      setCreateForm({ ...emptyEditForm, lowStockThreshold: 10 });
      event.target.reset();
    } else {
      toast.error(result.error?.message || "Unable to create product");
    }
  };

  const removeProduct = async (product) => {
    const result = await dispatch(deleteProduct(product._id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success("Product deleted");
    } else {
      toast.error(result.error?.message || "Unable to delete product");
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader
        eyebrow={user?.role === "ADMIN" ? "Admin" : "Warehouse"}
        title="Manage products"
        description="Add, edit, and delete catalog products. New quantity starts in general stock."
      />
      <form onSubmit={submitCreate} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Add product</h2>
        </div>
        <Input label="Product Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
        <Input label="SKU" value={createForm.sku} onChange={(e) => setCreateForm({ ...createForm, sku: e.target.value })} required />
        <Input label="Brand" value={createForm.brand} onChange={(e) => setCreateForm({ ...createForm, brand: e.target.value })} />
        <Input label="Category" value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })} />
        <Input label="Price" type="number" value={createForm.price} onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })} required />
        <Input label="General Stock" type="number" value={createForm.generalStock} onChange={(e) => setCreateForm({ ...createForm, generalStock: e.target.value })} required />
        <Input label="Low Stock Threshold" type="number" value={createForm.lowStockThreshold} onChange={(e) => setCreateForm({ ...createForm, lowStockThreshold: e.target.value })} />
        <Input label="Product Image" type="file" accept="image/*" onChange={(e) => setCreateForm({ ...createForm, image: e.target.files?.[0] || null })} />
        <div className="md:col-span-2">
          <Input label="Description" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Create Product</Button>
        </div>
      </form>
      <Table
        columns={[
          {
            key: "imageUrl",
            label: "Image",
            render: (product) =>
              product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
              ),
          },
          { key: "name", label: "Product" },
          { key: "sku", label: "SKU" },
          { key: "brand", label: "Brand", render: (product) => product.brand || "-" },
          { key: "price", label: "Price", render: (product) => formatCurrency(product.price) },
          { key: "generalStock", label: "General Stock" },
          { key: "warehouseStock", label: "Warehouse Stock" },
          { key: "storeStock", label: "Store Stock" },
          { key: "lowStockThreshold", label: "Threshold" },
          {
            key: "actions",
            label: "Actions",
            render: (product) => (
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => startEdit(product)}>
                  Edit
                </Button>
                <Button type="button" variant="warning" onClick={() => removeProduct(product)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={items}
      />

      {editingProduct && (
        <form onSubmit={submitEdit} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Edit {editingProduct.name}</h2>
          </div>
          <Input label="Product Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
          <Input label="SKU" value={editForm.sku} onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })} required />
          <Input label="Brand" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} />
          <Input label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-600">Price</span>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white/90 pr-4 focus-within:border-teal-600">
              <input
                className="w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                required
              />
              <span className="text-sm font-semibold text-slate-500">INR</span>
            </div>
          </label>
          <Input label="General Stock" type="number" value={editForm.generalStock} onChange={(e) => setEditForm({ ...editForm, generalStock: e.target.value })} />
          <Input label="Warehouse Stock" type="number" value={editForm.warehouseStock} onChange={(e) => setEditForm({ ...editForm, warehouseStock: e.target.value })} required />
          <Input label="Store Stock" type="number" value={editForm.storeStock} onChange={(e) => setEditForm({ ...editForm, storeStock: e.target.value })} />
          <Input label="Low Stock Threshold" type="number" value={editForm.lowStockThreshold} onChange={(e) => setEditForm({ ...editForm, lowStockThreshold: e.target.value })} />
          <Input label="Replace Image" type="file" accept="image/*" onChange={(e) => setEditForm({ ...editForm, image: e.target.files?.[0] || null })} />
          <div className="md:col-span-2">
            <Input label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </PageWrapper>
  );
}

export default ManageStock;
