import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cartService from "../../services/cartService";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { formatCurrency } from "../../utils/formatCurrency";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    const response = await cartService.get();
    setCart(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    const response = await cartService.updateItem(itemId, Number(quantity));
    setCart(response.data.data);
  };

  const removeItem = async (itemId) => {
    const response = await cartService.removeItem(itemId);
    setCart(response.data.data);
  };

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Store"
        title="Cart"
        description="Review selected products and quantities before checkout."
      />
      <div className="glass-panel overflow-hidden rounded-3xl">
        {loading && <p className="p-6 text-sm text-slate-500">Loading cart...</p>}
        {!loading && cart.items.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            Your cart is empty. <Link to="/store/browse-products">Browse products</Link>
          </div>
        )}
        {cart.items.map((item) => (
          <div key={item._id} className="grid gap-4 border-b border-slate-100 p-5 md:grid-cols-[1fr_120px_120px_auto] md:items-center">
            <div>
              <h3 className="font-semibold text-slate-900">{item.product?.name}</h3>
              <p className="text-sm text-slate-500">{item.product?.sku}</p>
              {item.warehouse && (
                <p className="text-sm text-slate-500">
                  Warehouse: {item.warehouse.name} {item.warehouse.code ? `(${item.warehouse.code})` : ""}
                </p>
              )}
              <p className="text-sm font-semibold text-teal-700">{formatCurrency(item.product?.price)}</p>
            </div>
            <Input
              label="Qty"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => updateQuantity(item._id, event.target.value)}
            />
            <p className="text-sm font-semibold text-slate-700">
              {formatCurrency(item.product?.price * item.quantity)}
            </p>
            <Button type="button" variant="warning" onClick={() => removeItem(item._id)}>
              Remove
            </Button>
          </div>
        ))}
        {cart.items.length > 0 && (
          <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">Total {formatCurrency(total)}</p>
            <Link to="/store/checkout">
              <Button type="button">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
