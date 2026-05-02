import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { transferGeneralToWarehouse, transferWarehouseToStore, transferWarehouseToWarehouse } from "../../features/stock/stockSlice";
import productService from "../../services/productService";
import warehouseService from "../../services/warehouseService";
import storeService from "../../services/storeService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SectionHeader from "../../components/common/SectionHeader";

function SelectField({ label, value, onChange, options, placeholder, required = true }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-teal-600"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TransferStock() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeTransferForm, setStoreTransferForm] = useState({
    productId: "",
    sourceWarehouseId: "",
    destinationStoreId: "",
    quantity: 1,
  });
  const [warehouseTransferForm, setWarehouseTransferForm] = useState({
    productId: "",
    sourceWarehouseId: "",
    destinationWarehouseId: "",
    quantity: 1,
  });
  const [generalForm, setGeneralForm] = useState({
    productId: "",
    destinationWarehouseId: "",
    quantity: 1,
  });

  useEffect(() => {
    const loadOptions = async () => {
      const [productResponse, warehouseResponse, storeResponse] = await Promise.all([
        productService.getAll(),
        warehouseService.getAll(),
        storeService.getAll(),
      ]);

      setProducts(
        productResponse.data.data.map((product) => ({
          ...product,
          label: `${product.name} (${product.sku})`,
        }))
      );
      setWarehouses(
        warehouseResponse.data.data.map((warehouse) => ({
          ...warehouse,
          label: `${warehouse.name} (${warehouse.code})`,
        }))
      );
      setStores(
        storeResponse.data.data.map((store) => ({
          ...store,
          label: `${store.name} (${store.code})`,
        }))
      );
    };

    loadOptions();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6">
        <SectionHeader eyebrow="Warehouse" title="General to warehouse" description="Move newly created general stock into a warehouse." />
        <form
          className="glass-panel space-y-4 rounded-3xl p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await dispatch(transferGeneralToWarehouse(generalForm));
            if (transferGeneralToWarehouse.fulfilled.match(result)) {
              toast.success("Stock transferred to warehouse");
              setGeneralForm({ productId: "", destinationWarehouseId: "", quantity: 1 });
            } else {
              toast.error(result.error?.message || "Transfer failed");
            }
          }}
        >
          <SelectField label="Product" value={generalForm.productId} onChange={(e) => setGeneralForm({ ...generalForm, productId: e.target.value })} options={products} placeholder="Select product" />
          <SelectField label="Destination Warehouse" value={generalForm.destinationWarehouseId} onChange={(e) => setGeneralForm({ ...generalForm, destinationWarehouseId: e.target.value })} options={warehouses} placeholder="Select destination warehouse" />
          <Input label="Quantity" type="number" min="1" value={generalForm.quantity} onChange={(e) => setGeneralForm({ ...generalForm, quantity: Number(e.target.value) })} required />
          <Button type="submit">Transfer to Warehouse</Button>
        </form>
      </div>
      <div className="space-y-6">
        <SectionHeader eyebrow="Warehouse" title="Transfer to store" description="Move inventory from a warehouse to a store location." />
        <form
          className="glass-panel space-y-4 rounded-3xl p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await dispatch(transferWarehouseToStore(storeTransferForm));
            if (transferWarehouseToStore.fulfilled.match(result)) {
              toast.success("Stock transferred to store");
              setStoreTransferForm({ productId: "", sourceWarehouseId: "", destinationStoreId: "", quantity: 1 });
            } else {
              toast.error(result.error?.message || "Transfer failed");
            }
          }}
        >
          <SelectField label="Product" value={storeTransferForm.productId} onChange={(e) => setStoreTransferForm({ ...storeTransferForm, productId: e.target.value })} options={products} placeholder="Select product" />
          <SelectField label="Source Warehouse" value={storeTransferForm.sourceWarehouseId} onChange={(e) => setStoreTransferForm({ ...storeTransferForm, sourceWarehouseId: e.target.value })} options={warehouses} placeholder="Select source warehouse" />
          <SelectField label="Destination Store" value={storeTransferForm.destinationStoreId} onChange={(e) => setStoreTransferForm({ ...storeTransferForm, destinationStoreId: e.target.value })} options={stores} placeholder="Select destination store" />
          <Input label="Quantity" type="number" min="1" value={storeTransferForm.quantity} onChange={(e) => setStoreTransferForm({ ...storeTransferForm, quantity: Number(e.target.value) })} required />
          <Button type="submit">Transfer to Store</Button>
        </form>
      </div>
      <div className="space-y-6">
        <SectionHeader eyebrow="Warehouse" title="Transfer to warehouse" description="Rebalance inventory between warehouses." />
        <form
          className="glass-panel space-y-4 rounded-3xl p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await dispatch(transferWarehouseToWarehouse(warehouseTransferForm));
            if (transferWarehouseToWarehouse.fulfilled.match(result)) {
              toast.success("Stock transferred between warehouses");
              setWarehouseTransferForm({ productId: "", sourceWarehouseId: "", destinationWarehouseId: "", quantity: 1 });
            } else {
              toast.error(result.error?.message || "Transfer failed");
            }
          }}
        >
          <SelectField label="Product" value={warehouseTransferForm.productId} onChange={(e) => setWarehouseTransferForm({ ...warehouseTransferForm, productId: e.target.value })} options={products} placeholder="Select product" />
          <SelectField label="Source Warehouse" value={warehouseTransferForm.sourceWarehouseId} onChange={(e) => setWarehouseTransferForm({ ...warehouseTransferForm, sourceWarehouseId: e.target.value })} options={warehouses} placeholder="Select source warehouse" />
          <SelectField label="Destination Warehouse" value={warehouseTransferForm.destinationWarehouseId} onChange={(e) => setWarehouseTransferForm({ ...warehouseTransferForm, destinationWarehouseId: e.target.value })} options={warehouses.filter((warehouse) => warehouse._id !== warehouseTransferForm.sourceWarehouseId)} placeholder="Select destination warehouse" />
          <Input label="Quantity" type="number" min="1" value={warehouseTransferForm.quantity} onChange={(e) => setWarehouseTransferForm({ ...warehouseTransferForm, quantity: Number(e.target.value) })} required />
          <Button type="submit">Transfer to Warehouse</Button>
        </form>
      </div>
    </div>
  );
}

export default TransferStock;
