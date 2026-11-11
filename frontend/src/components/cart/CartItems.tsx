import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import {
  useCartContext,
  type CartItem,
} from "@/features/cart/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";

type CartItemProps = {
  item: CartItem;
};

const CartItems = ({ item }: CartItemProps) => {
  const { removeFromCart, updateQuantity } = useCartContext();
  const { product, quantity } = item;

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="my-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full rounded-xl object-contain"
          />
        </div>

        {/* Product Information */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {product.category}
              </p>

              <h2 className="mt-1 text-sm font-semibold text-slate-900">
                {product.title}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {product.subCategory || product.mainCategory}
              </p>
            </div>

            <p className="whitespace-nowrap text-base font-bold text-slate-900">
              {formatCurrency(product.price)}
            </p>
          </div>

          {/* Quantity and Remove */}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center rounded-full bg-slate-100">
              <QuantitySelector
                quantity={quantity}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
              />
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
