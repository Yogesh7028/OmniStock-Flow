import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import EntityTablePage from "../shared/EntityTablePage";
import { formatCurrency } from "../../utils/formatCurrency";

function StoreInventory() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <EntityTablePage
      eyebrow="Store"
      title="Store inventory"
      description="View available inventory and reorder candidates."
      loading={loading}
      data={items}
      columns={[
        { key: "name", label: "Product" },
        { key: "category", label: "Category" },
        { key: "brand", label: "Brand" },
        { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
        { key: "storeStock", label: "Store Stock" },
        {
          key: "reorder",
          label: "Reorder",
          render: (row) => (row.storeStock <= row.lowStockThreshold ? "Recommended" : "Healthy"),
        },
      ]}
    />
  );
}

export default StoreInventory;
