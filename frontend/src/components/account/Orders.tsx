import OrderCard from "@/components/account/OrderCard";
import { orders } from "@/data/order";

const Orders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>

        <p className="mt-1 text-gray-500">
          View and manage your recent purchases.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;