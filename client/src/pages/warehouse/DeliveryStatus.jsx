import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageCheck, Truck, CheckCircle2 } from "lucide-react";
import { fetchOrders, updateOrderStatus } from "../../features/orders/orderSlice";
import Button from "../../components/common/Button";
import PageWrapper from "../../components/animations/PageWrapper";
import SectionHeader from "../../components/common/SectionHeader";

const statuses = [
  { label: "Packed", icon: PackageCheck },
  { label: "Dispatched", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

function DeliveryStatus() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow="Warehouse" title="Delivery status" description="Prepare dispatches and update warehouse delivery movement." />
      <div className="space-y-4">
        {items.map((order) => (
          <div key={order._id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="text-lg font-semibold">#{order._id.slice(-8).toUpperCase()}</h3>
                <p className="text-sm text-slate-500">Current status: {order.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    type="button"
                    variant={label === order.status ? "warning" : "secondary"}
                    onClick={() => dispatch(updateOrderStatus({ id: order._id, status: label }))}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon size={16} />
                      {label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default DeliveryStatus;
