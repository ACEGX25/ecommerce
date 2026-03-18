"use client";

import Link from "next/link";
import { Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, moveToPurchase, moveAllToPurchase } = useCart();

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">BAG ({totalItems})</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">Your bag is empty.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-primary transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_320px] gap-8">
            {/* Items */}
            <div className="border">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className={`flex gap-4 p-4 ${idx < items.length - 1 ? "border-b" : ""}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="heading-l2 text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                    <p className="meta-text text-primary mt-1">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="meta-text text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveToPurchase(item.product.id, item.size)}
                        className="ml-auto inline-flex items-center gap-1 text-xs font-medium bg-foreground text-background px-3 py-1.5 hover:bg-primary transition-colors duration-150"
                      >
                        Move to Purchase
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-xs text-muted-foreground underline hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border p-6 h-fit">
              <h2 className="heading-l2 mb-4">BAG SUMMARY</h2>
              <div className="space-y-2 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="meta-text">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="meta-text">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={moveAllToPurchase}
                className="w-full bg-foreground text-background px-6 py-3 font-medium text-sm uppercase tracking-wide hover:bg-primary transition-colors duration-200 mb-3"
              >
                Move All to Purchase
              </button>
              <Link
                href="/purchase"
                className="block w-full text-center border border-foreground px-6 py-3 font-medium text-sm uppercase tracking-wide hover:bg-muted transition-colors duration-200"
              >
                Go to Purchase
              </Link>
              <Link
                href="/"
                className="block text-center text-xs text-muted-foreground underline mt-4 hover:text-foreground"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;