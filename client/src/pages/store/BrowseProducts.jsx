import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { fetchProducts } from "../../features/products/productSlice";
import AnimatedCard from "../../components/animations/AnimatedCard";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import cartService from "../../services/cartService";
import warehouseService from "../../services/warehouseService";
import { formatCurrency } from "../../utils/formatCurrency";

function BrowseProducts() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    warehouse: "",
    minPrice: "",
    maxPrice: "",
  });
  const [quantities, setQuantities] = useState({});
  const [selectedWarehouses, setSelectedWarehouses] = useState({});
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    warehouseService
      .getAll()
      .then((response) => setWarehouses(response.data.data || []))
      .catch(() => toast.error("Unable to load warehouses"));
  }, [dispatch]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
    [items]
  );
  const brands = useMemo(
    () => Array.from(new Set(items.map((item) => item.brand).filter(Boolean))),
    [items]
  );

  const warehouseStockByProduct = useMemo(() => {
    const stockMap = new Map();
    warehouses.forEach((warehouse) => {
      (warehouse.stock || []).forEach((entry) => {
        const productId = entry.product?._id || entry.product;
        if (!productId) return;
        if (!stockMap.has(productId)) stockMap.set(productId, []);
        stockMap.get(productId).push({
          warehouseId: warehouse._id,
          warehouseName: warehouse.name,
          warehouseCode: warehouse.code,
          quantity: Number(entry.quantity || 0),
        });
      });
    });
    return stockMap;
  }, [warehouses]);

  const filteredProducts = items.filter((product) => {
    const query = filters.search.toLowerCase();
    const warehouseOptions = warehouseStockByProduct.get(product._id) || [];
    const matchesSearch =
      !query ||
      [product.name, product.sku, product.description, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesWarehouse =
      !filters.warehouse ||
      warehouseOptions.some(
        (option) => option.warehouseId === filters.warehouse && option.quantity > 0
      );
    const matchesMin = !filters.minPrice || Number(product.price) >= Number(filters.minPrice);
    const matchesMax = !filters.maxPrice || Number(product.price) <= Number(filters.maxPrice);
    return matchesSearch && matchesCategory && matchesBrand && matchesWarehouse && matchesMin && matchesMax;
  });

  const addToCart = async (product) => {
    const warehouseOptions = warehouseStockByProduct.get(product._id) || [];
    const warehouseId =
      filters.warehouse ||
      selectedWarehouses[product._id] ||
      warehouseOptions.find((option) => option.quantity > 0)?.warehouseId;

    if (!warehouseId) {
      toast.error("Choose a warehouse with available stock");
      return;
    }

    await cartService.add({
      productId: product._id,
      quantity: Number(quantities[product._id] || 1),
      warehouseId,
    });
    toast.success("Added to cart");
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader
        eyebrow="Store"
        title="Browse products"
        description="Search products, compare stock, and build your purchase cart."
      />

      <div className="glass-panel grid gap-3 rounded-3xl p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-600"
            placeholder="Search products"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </label>
        <select
          className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
          value={filters.brand}
          onChange={(event) => setFilters({ ...filters, brand: event.target.value })}
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
          value={filters.warehouse}
          onChange={(event) => setFilters({ ...filters, warehouse: event.target.value })}
        >
          <option value="">All warehouses</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse._id} value={warehouse._id}>
              {warehouse.name} {warehouse.code ? `(${warehouse.code})` : ""}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Min" type="number" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
          <Input label="Max" type="number" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const warehouseOptions = warehouseStockByProduct.get(product._id) || [];
          const availableWarehouses = warehouseOptions.filter((option) => option.quantity > 0);
          const selectedWarehouseId =
            filters.warehouse ||
            selectedWarehouses[product._id] ||
            availableWarehouses[0]?.warehouseId ||
            "";
          const selectedStock = availableWarehouses.find(
            (option) => option.warehouseId === selectedWarehouseId
          )?.quantity;
          const totalWarehouseStock = warehouseOptions.reduce(
            (sum, option) => sum + Number(option.quantity || 0),
            0
          );

          return (
            <AnimatedCard key={product._id} className="glass-panel rounded-3xl p-5">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />}
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{product.sku}</p>
              <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{product.brand || product.category}</p>
              <p className="mt-2 text-sm text-slate-500">{product.description}</p>
              {product.features?.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-slate-500">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  Stock {filters.warehouse ? selectedStock || 0 : totalWarehouseStock}
                </span>
              </div>
              <label className="mt-4 block space-y-2">
                <span className="text-sm font-medium text-slate-600">Warehouse</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
                  value={selectedWarehouseId}
                  onChange={(event) =>
                    setSelectedWarehouses({ ...selectedWarehouses, [product._id]: event.target.value })
                  }
                  disabled={Boolean(filters.warehouse) || availableWarehouses.length === 0}
                >
                  {availableWarehouses.length === 0 ? (
                    <option value="">No warehouse stock</option>
                  ) : (
                    availableWarehouses.map((warehouse) => (
                      <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                        {warehouse.warehouseName} {warehouse.warehouseCode ? `(${warehouse.warehouseCode})` : ""} - {warehouse.quantity}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <div className="mt-4 flex gap-2">
                <Input
                  label="Qty"
                  type="number"
                  min="1"
                  max={selectedStock || undefined}
                  value={quantities[product._id] || 1}
                  onChange={(event) => setQuantities({ ...quantities, [product._id]: event.target.value })}
                />
                <Button type="button" disabled={availableWarehouses.length === 0} onClick={() => addToCart(product)}>
                  Add
                </Button>
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </PageWrapper>
  );
}

export default BrowseProducts;
