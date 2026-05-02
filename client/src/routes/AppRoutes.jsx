import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleRoute from "../components/protected/RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import { roleHome, useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageWarehouses from "../pages/admin/ManageWarehouses";
import ManageStores from "../pages/admin/ManageStores";
import ManageOrders from "../pages/admin/ManageOrders";
import ManagePayments from "../pages/admin/ManagePayments";
import ManageInvoices from "../pages/admin/ManageInvoices";
import Reports from "../pages/admin/Reports";
import WarehouseDashboard from "../pages/warehouse/WarehouseDashboard";
import AddProduct from "../pages/warehouse/AddProduct";
import ManageStock from "../pages/warehouse/ManageStock";
import TransferStock from "../pages/warehouse/TransferStock";
import StockHistory from "../pages/warehouse/StockHistory";
import LowStockAlerts from "../pages/warehouse/LowStockAlerts";
import WarehouseInvoices from "../pages/warehouse/WarehouseInvoices";
import WarehouseOrders from "../pages/warehouse/WarehouseOrders";
import WarehouseDeliveryStatus from "../pages/warehouse/DeliveryStatus";
import WarehouseReports from "../pages/warehouse/WarehouseReports";
import WarehouseProfile from "../pages/warehouse/Profile";
import StoreDashboard from "../pages/store/StoreDashboard";
import BrowseProducts from "../pages/store/BrowseProducts";
import Cart from "../pages/store/Cart";
import Checkout from "../pages/store/Checkout";
import MyOrders from "../pages/store/MyOrders";
import TrackOrder from "../pages/store/TrackOrder";
import StoreSupplierDeliveries from "../pages/store/SupplierDeliveries";
import MyInvoices from "../pages/store/MyInvoices";
import StoreInventory from "../pages/store/StoreInventory";
import PurchaseAnalytics from "../pages/store/PurchaseAnalytics";
import SupplierDashboard from "../pages/supplier/SupplierDashboard";
import SupplierOrders from "../pages/supplier/SupplierOrders";
import DeliveryStatus from "../pages/supplier/UpdateDeliveryStatus";
import DeliveryHistory from "../pages/supplier/DeliveryHistory";
import Notifications from "../pages/Notifications";
import SupportTickets from "../pages/SupportTickets";
import Settings from "../pages/Settings";

function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role] || "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/support-tickets" element={<SupportTickets />} />
          <Route path="/settings" element={<Settings />} />

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/warehouses" element={<ManageWarehouses />} />
            <Route path="/admin/stores" element={<ManageStores />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/payments" element={<ManagePayments />} />
            <Route path="/admin/invoices" element={<ManageInvoices />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["WAREHOUSE_MANAGER"]} />}>
            <Route path="/warehouse" element={<WarehouseDashboard />} />
            <Route path="/warehouse/warehouses" element={<ManageWarehouses />} />
            <Route path="/warehouse/add-product" element={<AddProduct />} />
            <Route path="/warehouse/manage-stock" element={<ManageStock />} />
            <Route path="/warehouse/transfer-stock" element={<TransferStock />} />
            <Route path="/warehouse/orders" element={<WarehouseOrders />} />
            <Route path="/warehouse/delivery-status" element={<WarehouseDeliveryStatus />} />
            <Route path="/warehouse/stock-history" element={<StockHistory />} />
            <Route path="/warehouse/low-stock-alerts" element={<LowStockAlerts />} />
            <Route path="/warehouse/invoices" element={<WarehouseInvoices />} />
            <Route path="/warehouse/reports" element={<WarehouseReports />} />
            <Route path="/warehouse/profile" element={<WarehouseProfile />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["STORE_MANAGER"]} />}>
            <Route path="/store" element={<StoreDashboard />} />
            <Route path="/store/browse-products" element={<BrowseProducts />} />
            <Route path="/store/cart" element={<Cart />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route path="/store/my-orders" element={<MyOrders />} />
            <Route path="/store/track-order" element={<TrackOrder />} />
            <Route path="/store/supplier-deliveries" element={<StoreSupplierDeliveries />} />
            <Route path="/store/invoices" element={<MyInvoices />} />
            <Route path="/store/inventory" element={<StoreInventory />} />
            <Route path="/store/analytics" element={<PurchaseAnalytics />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["SUPPLIER"]} />}>
            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/orders" element={<SupplierOrders />} />
            <Route path="/supplier/delivery-status" element={<DeliveryStatus />} />
            <Route path="/supplier/delivery-history" element={<DeliveryHistory />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
