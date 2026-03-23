"use client";

import Link from "next/link";
import { Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit:   { opacity: 0, x: 100, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, moveToPurchase, moveAllToPurchase } = useCart();

  return (
    <div className="pt-16 min-h-screen">
      {/* Heading */}
      <motion.div
        className="border-b px-4 md:px-8 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">BAG ({totalItems})</h1>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            // Empty state
            <motion.div
              key="empty"
              className="text-center py-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted-foreground mb-6">Your bag is empty.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium uppercase tracking-wide hover:bg-primary transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              className="grid md:grid-cols-[1fr_320px] gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Items list — parent stagger */}
              <motion.div
                className="border"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      variants={itemVariants}
                      exit="exit"   // exit is defined in itemVariants
                      className={`flex gap-4 p-4 ${idx < items.length - 1 ? "border-b" : ""}`}
                      layout        // smoothly collapses space when item is removed
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
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <span className="meta-text text-xs w-4 text-center">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="border w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors duration-150"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => moveToPurchase(item.product.id, item.size)}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-medium bg-foreground text-background px-3 py-1.5 hover:bg-primary transition-colors duration-150"
                          >
                            Move to Purchase
                            <ArrowRight className="h-3 w-3" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="text-xs text-muted-foreground underline hover:text-foreground"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Summary panel — slides in from right */}
              <motion.div
                className="border p-6 h-fit"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              >
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
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={moveAllToPurchase}
                  className="w-full bg-foreground text-background px-6 py-3 font-medium text-sm uppercase tracking-wide hover:bg-primary transition-colors duration-200 mb-3"
                >
                  Move All to Purchase
                </motion.button>
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;