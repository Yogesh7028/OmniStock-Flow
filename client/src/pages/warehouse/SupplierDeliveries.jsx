import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveSupplierDelivery, fetchOrders } from "../../features/orders/orderSlice";
import Button from "../../components/common/Button";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import { formatDate } from "../../utils/helpers";

function SupplierDeliveries() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);
  const deliveries = items.filter((order) => ["Shipped", "Dispatched", "Delivered"].includes(order.status));

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Warehouse" title="Supplier deliveries" description="Receive supplier deliveries and update warehouse stock automatically." />
      <div className="grid gap-4 xl:grid-cols-2">
        {deliveries.map((order) => (
          <div key={order._id} className="glass-panel rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">#{order._id.slice(-8).toUpperCase()}</h3>
                <p className="text-sm text-slate-500">Supplier: {order.supplier?.name || "Unassigned"}</p>
                <p className="text-sm text-slate-500">Status: {order.status}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.warehouseReceived ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {order.warehouseReceived ? "Received" : "Pending receipt"}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {(order.items || []).map((item) => (
                <div key={`${order._id}-${item.productName}`} className="flex justify-between rounded-2xl bg-white/70 px-4 py-3">
                  <span>{item.productName}</span>
                  <span className="font-semibold">Qty {item.quantity}</span>
                </div>
              ))}
            </div>
            {order.receivedAt && <p className="mt-4 text-xs text-slate-500">Received {formatDate(order.receivedAt)}</p>}
            <Button className="mt-4" disabled={order.warehouseReceived} onClick={() => dispatch(receiveSupplierDelivery(order._id))}>
              Receive Into Stock
            </Button>
          </div>
        ))}
        {deliveries.length === 0 && <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-500 xl:col-span-2">No supplier deliveries are ready to receive.</div>}
      </div>
    </PageWrapper>
  );
}

export default SupplierDeliveries;
