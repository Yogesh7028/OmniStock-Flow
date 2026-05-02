import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { fetchOrders } from "../../features/orders/orderSlice";
import { fetchUsers } from "../../features/users/userSlice";
import DashboardWidgets from "../shared/DashboardWidgets";
import InventoryChart from "../shared/InventoryChart";
import SectionHeader from "../../components/common/SectionHeader";
import PageWrapper from "../../components/animations/PageWrapper";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { items: users } = useSelector((state) => state.users);
  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const { items: orders, loading: ordersLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = [
    { title: "Users", value: users.length, subtitle: "Across all roles" },
    { title: "Products", value: products.length, subtitle: "Managed catalog" },
    { title: "Orders", value: orders.length, subtitle: "Tracked lifecycle" },
    {
      title: "Low stock",
      value: products.filter((product) => product.warehouseStock + product.storeStock <= product.lowStockThreshold).length,
      subtitle: "Needs replenishment",
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Enterprise operations cockpit"
        description="Monitor users, inventory pressure, and order throughput from one command surface."
      />
      <DashboardWidgets stats={stats} loading={productsLoading || ordersLoading} />
      <InventoryChart data={products.slice(0, 8)} />
    </PageWrapper>
  );
}

export default AdminDashboard;
