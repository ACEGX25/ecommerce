"use client"

const orders = [
    {
    id: "#8472-A",
    date: "2026-03-10",
    status: "Delivered",
    items: [
      { name: "Supima Cotton Crew Tee", size: "M", qty: 2, price: 19.9 },
      { name: "Stretch Slim Chino", size: "32", qty: 1, price: 39.9 },
    ],
  },

  {
    id: "#8391-B",
    date: "2026-02-22",
    status: "In Transit",
    items: [
      { name: "Dry Sweat Pullover Hoodie", size: "L", qty: 1, price: 29.9 },
    ],
  },

  {
    id: "#8205-C",
    date: "2026-01-15",
    status: "Delivered",
    items: [
      { name: "Linen Blend Shirt", size: "M", qty: 1, price: 34.9 },
      { name: "MA-1 Bomber Jacket", size: "M", qty: 1, price: 59.9 }
    ],
  },
]

const statusColor = (status: string): string => {
  switch (status) {
    case "Delivered":
      return "bg-foreground text-background";
    case "In Transit":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function OrdersPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ORDERS</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {orders.length} orders on file
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border mb-0 last:mb-0 [&:not(:first-child)]:border-t-0"
          >
            {/* Order header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted">
              <div className="flex items-center gap-4">
                <span className="meta-text font-medium">{order.id}</span>
                <span className="text-xs text-muted-foreground">
                  {order.date}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Line items */}
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border-b last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {item.size} · Qty: {item.qty}
                  </p>
                </div>
                <span className="meta-text text-primary">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Order total */}
            <div className="flex items-center justify-between p-4 bg-muted">
              <span className="text-sm font-medium">Total</span>
              <span className="meta-text text-primary font-medium">
                ${order.items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}