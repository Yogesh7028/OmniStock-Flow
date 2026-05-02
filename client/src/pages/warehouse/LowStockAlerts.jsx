import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import EntityTablePage from "../shared/EntityTablePage";

function LowStockAlerts() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const lowStock = items.filter(
    (item) => (item.warehouseStock || 0) + (item.storeStock || 0) <= item.lowStockThreshold
  );

  return (
    <EntityTablePage
      eyebrow="Warehouse"
      title="Low stock alerts"
      description="Products that have reached or fallen below their configured threshold."
      columns={[
        { key: "name", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "warehouseStock", label: "Warehouse" },
        { key: "storeStock", label: "Store" },
        { key: "lowStockThreshold", label: "Threshold" },
      ]}
      data={lowStock}
    />
  );
}

export default LowStockAlerts;
