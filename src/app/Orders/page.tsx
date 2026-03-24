"use client"

import { useEffect, useState } from "react"

// ─── Types ────────────────────────────────────────────────────
interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price_at_purchase: number
}

interface Order {
  id: number
  total_amount: number
  status: string
  shipping_address: string
  created_at: string
  items: OrderItem[]
}

// ─── Helpers ──────────────────────────────────────────────────
const statusColor = (status: string): string => {
  switch (status) {
    case "delivered":
      return "bg-foreground text-background"
    case "shipped":
      return "bg-primary text-primary-foreground"
    case "confirmed":
      return "bg-blue-100 text-blue-800"
    case "cancelled":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

// ─── Component ────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJlbWFpbCI6ImdpcmlzaEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3NDM1NzY4MCwiZXhwIjoxNzc0MzU4NTgwLCJhdWQiOiJkaW5nbHktY2xpZW50IiwiaXNzIjoiZGluZ2x5In0.GBsYoboaH8WgzdGj5GhbDEzxwoyl4m9Dh3LAJ6FwXB4"
        // const token = document.cookie
        //   .split("; ")
        //   .find((row) => row.startsWith("accessToken="))
        //   ?.split("=")[1]

        // if (!token) {
        //   setError("Not authenticated")
        //   setLoading(false)
        //   return
        // }

        const res = await fetch(`http://localhost:4000/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (!res.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await res.json()
        console.log("API response:", JSON.stringify(data, null, 2))  // add this
        setOrders(data.orders)

      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // ─── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="border-b px-4 md:px-8 py-6">
          <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ORDERS</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 text-center text-muted-foreground text-sm">
          Loading orders...
        </div>
      </div>
    )
  }

  // ─── Error ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="border-b px-4 md:px-8 py-6">
          <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ORDERS</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 text-center text-destructive text-sm">
          {error}
        </div>
      </div>
    )
  }

  // ─── Empty ─────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="border-b px-4 md:px-8 py-6">
          <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ORDERS</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 text-center text-muted-foreground text-sm">
          No orders yet.
        </div>
      </div>
    )
  }

  // ─── Orders list ───────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ORDERS</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {orders.length} {orders.length === 1 ? "order" : "orders"} on file
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
                <span className="meta-text font-medium">#{order.id}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${statusColor(order.status)}`}
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
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="meta-text text-primary">
                  ₹{(item.price_at_purchase * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Order total */}
            <div className="flex items-center justify-between p-4 bg-muted">
              <span className="text-sm font-medium">Total</span>
              <span className="meta-text text-primary font-medium">
                ₹{Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}