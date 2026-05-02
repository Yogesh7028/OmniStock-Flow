import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchOrders, updateOrderStatus } from "../../features/orders/orderSlice";
import Button from "../../components/common/Button";
import SectionHeader from "../../components/common/SectionHeader";

const statuses = ["Pending", "Packed", "Dispatched", "Delivered"];

function DeliveryStatus() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Supplier" title="Update delivery status" description="Move order state forward and notify store owners of delivery progress." />
      <div className="space-y-4">
        {items.map((order) => (
          <div key={order._id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{order._id}</h3>
                <p className="text-sm text-slate-500">Current: {order.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => {
                  const isCurrent = status === order.status;
                  return (
                    <Button
                      key={status}
                      variant={isCurrent ? "warning" : "secondary"}
                      disabled={loading || isCurrent}
                      onClick={async () => {
                        const result = await dispatch(updateOrderStatus({ id: order._id, status }));
                        if (updateOrderStatus.fulfilled.match(result)) {
                          toast.success(`Order marked ${status}`);
                        } else {
                          toast.error(result.error?.message || "Unable to update order status");
                        }
                      }}
                    >
                      {status}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
            No assigned orders found.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default DeliveryStatus;
