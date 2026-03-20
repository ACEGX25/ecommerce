"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const cartVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as const },
  },
};

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, moveAllToPurchase } =
    useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-background border-l z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="heading-l2">BAG ({items.length})</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Your bag is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 p-4 border-b"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <p className="heading-l2 text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {item.size}
                      </p>
                      <p className="meta-text text-primary mt-1">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="border w-6 h-6 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="meta-text text-xs">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="border w-6 h-6 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="ml-auto text-xs text-muted-foreground underline hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="meta-text text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    moveAllToPurchase();
                    setIsOpen(false);
                    router.push("/purchase");
                  }}
                  className="w-full bg-foreground text-background px-6 py-3 font-medium text-sm uppercase tracking-wide hover:bg-primary transition-colors duration-200"
                >
                  Move to Purchase
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}