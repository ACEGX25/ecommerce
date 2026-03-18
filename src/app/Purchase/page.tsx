"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function PurchasePage() {
  const {
    purchaseItems,
    removePurchaseItem,
    updatePurchaseQuantity,
    totalPurchaseItems,
    totalPurchasePrice,
    clearPurchase,
  } = useCart();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = totalPurchasePrice > 100 ? 0 : 9.99;
  const tax = totalPurchasePrice * 0.08;
  const grandTotal = totalPurchasePrice + shippingCost + tax;

  const handleCheckout = () => {
    setOrderPlaced(true);
    clearPurchase();
  };

  if (orderPlaced) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="heading-l1 text-3xl mb-3">ORDER CONFIRMED</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-primary transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">
          PURCHASE ({totalPurchaseItems})
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {purchaseItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No items ready for purchase.</p>
            <p className="text-xs text-muted-foreground mb-6">
              Add items to your bag first, then move them here to checkout.
            </p>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-primary transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Bag
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-8">
            {/* Items */}
            <div className="border">
              {purchaseItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className={`flex gap-4 p-4 ${idx < purchaseItems.length - 1 ? "border-b" : ""}`}
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
                        onClick={() =>
                          updatePurchaseQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                        className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="meta-text text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updatePurchaseQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                        className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="ml-auto meta-text text-xs text-muted-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removePurchaseItem(item.product.id, item.size)}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="border p-6 h-fit">
              <h2 className="heading-l2 mb-4">CHECKOUT</h2>
              <div className="space-y-3 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({totalPurchaseItems} items)
                  </span>
                  <span className="meta-text">${totalPurchasePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="meta-text">
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="meta-text">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span className="meta-text text-primary">${grandTotal.toFixed(2)}</span>
              </div>
              {totalPurchasePrice < 100 && (
                <p className="text-[11px] text-muted-foreground mb-4 font-mono">
                  Add ${(100 - totalPurchasePrice).toFixed(2)} more for free shipping
                </p>
              )}
              <button
                onClick={handleCheckout}
                className="w-full bg-foreground text-background px-6 py-3 font-medium text-sm uppercase tracking-wide hover:bg-primary transition-colors duration-200"
              >
                Place Order
              </button>
              <Link
                href="/cart"
                className="block text-center text-xs text-muted-foreground underline mt-4 hover:text-foreground"
              >
                Back to Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
