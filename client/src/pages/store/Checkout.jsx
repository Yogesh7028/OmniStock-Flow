import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { createOrder } from "../../features/orders/orderSlice";
import { createPaymentOrder, verifyPayment, clearPaymentError } from "../../features/payments/paymentSlice";
import warehouseService from "../../services/warehouseService";
import supplierService from "../../services/supplierService";
import cartService from "../../services/cartService";
import PageWrapper from "../../components/animations/PageWrapper";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SectionHeader from "../../components/common/SectionHeader";
import ToastMessage from "../../components/common/ToastMessage";
import { formatCurrency } from "../../utils/formatCurrency";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Checkout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.products);
  const { latestOrder, error: orderError } = useSelector((state) => state.orders);
  const { current, verification, loading, error: paymentError } = useSelector((state) => state.payments);
  const [form, setForm] = useState({ product: "", quantity: 1, supplier: "", warehouse: "", paymentMethod: "RAZORPAY" });
  const [cart, setCart] = useState({ items: [] });
  const [statusMessage, setStatusMessage] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const deriveSuppliersFromProducts = (products) => {
    const uniqueSuppliers = new Map();
    products.forEach((product) => {
      const supplier = product?.supplier;
      if (supplier?._id) {
        uniqueSuppliers.set(supplier._id, {
          _id: supplier._id,
          name: supplier.name || "Unnamed supplier",
          email: supplier.email || "",
          phone: supplier.phone || "",
        });
      }
    });
    return Array.from(uniqueSuppliers.values());
  };

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true);
      setStatusMessage("");

      const productResult = await dispatch(fetchProducts());
      const fetchedProducts = productResult.payload || [];

      const [warehousesResult, suppliersResult] = await Promise.allSettled([
        warehouseService.getAll(),
        supplierService.getAll(),
      ]);
      const cartResult = await cartService.get().catch(() => null);
      if (cartResult) setCart(cartResult.data.data || { items: [] });

      if (warehousesResult.status === "fulfilled") {
        setWarehouses(warehousesResult.value.data.data || []);
      } else {
        setStatusMessage("Unable to load warehouses right now.");
      }

      if (suppliersResult.status === "fulfilled") {
        const supplierList = suppliersResult.value.data.data || [];
        if (supplierList.length > 0) {
          setSuppliers(supplierList);
        } else {
          setSuppliers(deriveSuppliersFromProducts(fetchedProducts));
        }
      } else {
        const fallbackSuppliers = deriveSuppliersFromProducts(fetchedProducts);
        setSuppliers(fallbackSuppliers);
        if (fallbackSuppliers.length === 0) {
          setStatusMessage("Unable to load suppliers. Please contact admin or create a supplier first.");
        }
      }

      setOptionsLoading(false);
    };

    loadOptions();
  }, [dispatch]);

  useEffect(() => {
    const currentUserId = user?.id || user?._id;
    if (!currentUserId || form.warehouse) return;

    const assignedWarehouse = warehouses.find(
      (warehouse) =>
        String(warehouse.manager?._id || warehouse.manager) === String(currentUserId)
    );

    if (assignedWarehouse) {
      setForm((prev) => ({ ...prev, warehouse: assignedWarehouse._id }));
      setStatusMessage(`Assigned warehouse auto-selected: ${assignedWarehouse.name}.`);
    }
  }, [warehouses, user, form.warehouse]);

  useEffect(() => {
    if (verification?.invoice?.invoiceNumber) {
      setStatusMessage(`Payment successful. Invoice ${verification.invoice.invoiceNumber} generated.`);
    }
  }, [verification]);

  const selectedWarehouse = warehouses.find((warehouse) => warehouse._id === form.warehouse);
  const selectedSupplier = suppliers.find((supplier) => supplier._id === form.supplier);
  const hasCartItems = cart.items?.length > 0;
  const cartWarehouseIds = useMemo(
    () =>
      Array.from(
        new Set(
          (cart.items || [])
            .map((item) => item.warehouse?._id || item.warehouse)
            .filter(Boolean)
        )
      ),
    [cart.items]
  );
  const hasMixedCartWarehouses = cartWarehouseIds.length > 1;
  const canSubmitOrder = Boolean(
    (form.product || hasCartItems) && form.supplier && form.warehouse && !hasMixedCartWarehouses
  );

  useEffect(() => {
    if (!hasCartItems || form.warehouse || cartWarehouseIds.length !== 1) return;
    setForm((prev) => ({ ...prev, warehouse: cartWarehouseIds[0] }));
  }, [cartWarehouseIds, form.warehouse, hasCartItems]);

  const createOrderHandler = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    dispatch(clearPaymentError());
    if (hasMixedCartWarehouses) {
      setStatusMessage("Cart items must come from one warehouse before creating an order.");
      return;
    }
    if (!canSubmitOrder) {
      setStatusMessage("Select a product, supplier, and warehouse before creating the order.");
      return;
    }
    const result = await dispatch(
      createOrder({
        items: hasCartItems
          ? cart.items.map((item) => ({ product: item.product._id, quantity: Number(item.quantity) }))
          : [{ product: form.product, quantity: Number(form.quantity) }],
        supplier: form.supplier || undefined,
        warehouse: form.warehouse || undefined,
        paymentMethod: form.paymentMethod,
      })
    );
    if (!result.error) {
      setStatusMessage(
        form.paymentMethod === "CASH"
          ? "Cash order confirmed and invoice generated."
          : "Order created. You can proceed to payment now."
      );
      if (hasCartItems) {
        await cartService.clear();
        setCart({ items: [] });
      }
    }
  };

  const payNowHandler = async () => {
    setStatusMessage("");
    dispatch(clearPaymentError());
    if (form.paymentMethod === "CASH") {
      setStatusMessage("Cash orders are confirmed when created.");
      return;
    }
    if (!form.supplier || !form.warehouse) {
      setStatusMessage("Choose both a supplier and a warehouse before starting payment.");
      return;
    }
    const orderId = latestOrder?._id || current?.payment?.order;
    if (!orderId) {
      setStatusMessage("Create an order before starting payment.");
      return;
    }
    const paymentOrder = await dispatch(createPaymentOrder({ orderId }));
    const paymentPayload = paymentOrder.payload;
    if (!paymentPayload) return;

    if (paymentPayload.razorpayOrder?.mock) {
      setStatusMessage("Razorpay is not configured correctly. Please contact admin.");
      return;
    }

    if (!import.meta.env.VITE_RAZORPAY_KEY) {
      setStatusMessage("Razorpay key is missing in the client configuration.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded || !window.Razorpay) {
      setStatusMessage("Unable to load Razorpay checkout. Check your internet connection and try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: paymentPayload.razorpayOrder.amount,
      currency: paymentPayload.razorpayOrder.currency,
      name: "OmniStock-Flow",
      description: "Warehouse-based purchase",
      order_id: paymentPayload.razorpayOrder.id,
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay using UPI",
              instruments: [{ method: "upi" }],
            },
            other: {
              name: "Other payment options",
              instruments: [
                { method: "card" },
                { method: "netbanking" },
                { method: "wallet" },
              ],
            },
          },
          sequence: ["block.upi", "block.other"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      handler: async (response) => {
        const verifyResult = await dispatch(
          verifyPayment({
            paymentId: paymentPayload.payment._id,
            razorpayOrderId: paymentPayload.razorpayOrder.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
        );
        if (!verifyResult.error) {
          setStatusMessage("Payment captured successfully.");
        }
      },
      modal: {
        ondismiss: () => setStatusMessage("Payment popup closed before completion."),
      },
      theme: { color: "#0f766e" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      setStatusMessage(
        response?.error?.description || "Payment failed. Please try again."
      );
    });
    razorpay.open();
  };

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Store" title="Checkout flow" description="Choose a warehouse, create an order, initiate Razorpay, and trigger invoice generation after payment capture." />
      <form onSubmit={createOrderHandler} className="glass-panel grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        {hasCartItems && (
          <div className="rounded-2xl bg-teal-50 p-4 text-sm font-semibold text-teal-700 md:col-span-2">
            Using {cart.items.length} cart item{cart.items.length === 1 ? "" : "s"} for this order.
          </div>
        )}
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-600">Product</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          >
            <option value="">Select product</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - {formatCurrency(item.price)}
              </option>
            ))}
          </select>
        </label>
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Payment Method</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          >
            <option value="RAZORPAY">Razorpay</option>
            <option value="CASH">Cash</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Supplier</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            disabled={optionsLoading}
          >
            <option value="">
              {optionsLoading ? "Loading suppliers..." : suppliers.length ? "Select supplier" : "No suppliers available"}
            </option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name} {supplier.email ? `- ${supplier.email}` : ""}
              </option>
            ))}
          </select>
          {selectedSupplier && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">{selectedSupplier.name}</p>
              <p>{selectedSupplier.email || "No email available"}</p>
              <p>{selectedSupplier.phone || "No phone available"}</p>
            </div>
          )}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Warehouse</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
            value={form.warehouse}
            onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
            disabled={optionsLoading}
          >
            <option value="">
              {optionsLoading ? "Loading warehouses..." : warehouses.length ? "Select warehouse" : "No warehouses available"}
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name} {warehouse.code ? `(${warehouse.code})` : ""}
              </option>
            ))}
          </select>
          {selectedWarehouse && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">{selectedWarehouse.name}</p>
              <p>{selectedWarehouse.code ? `Code: ${selectedWarehouse.code}` : "No warehouse code"}</p>
              <p>{selectedWarehouse.location || "No location available"}</p>
              <p>
                Manager: {selectedWarehouse.manager?.name || selectedWarehouse.manager?.email || "Unassigned"}
              </p>
            </div>
          )}
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <Button type="submit" disabled={!canSubmitOrder}>
            Create Order
          </Button>
          <Button type="button" variant="warning" onClick={payNowHandler} disabled={loading}>
            {loading ? "Processing..." : "Pay and Generate Invoice"}
          </Button>
        </div>
      </form>
      <ToastMessage
        message={paymentError || orderError || statusMessage}
        tone={paymentError || orderError ? "error" : "success"}
      />
      {latestOrder && (
        <div className="glass-panel rounded-3xl p-5 text-sm text-slate-600">
          Latest order: {latestOrder._id} | Status: {latestOrder.status} | Total: {formatCurrency(latestOrder.totalAmount)}
        </div>
      )}
    </PageWrapper>
  );
}

export default Checkout;
