"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product, variants }: { 
  product: Product,
  variants?: Variants   // accepts parent's variant, Variants type imported from framer-motion
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <motion.div
      className="product-cell group relative border bg-background p-4 flex flex-col"
      onMouseEnter={() => setShowSpecs(true)}
      onMouseLeave={() => setShowSpecs(false)}
      variants={variants}           // ← parent drives initial/animate now
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      // initial and animate removed — parent orchestrates these
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden mb-4 bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <AnimatePresence>
          {showSpecs && (
            <motion.div
              className="absolute bottom-0 left-0 bg-foreground/90 text-background p-2 text-[10px] font-mono leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div>[Material: {product.material}]</div>
              <div>[Weight: {product.weight}]</div>
              <div>[Fit: {product.fit}]</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <h3 className="heading-l2 text-sm">{product.name}</h3>
      <p className="meta-text text-red-500 mt-1">${product.price.toFixed(2)}</p>

      {/* Size picker */}
      <div className="flex flex-wrap gap-1 mt-3">
        {product.sizes.map((size) => (
          <motion.button
            key={size}
            onClick={() => setSelectedSize(size)}
            whileTap={{ scale: 0.92 }}
            className={`border px-2 py-1 text-[11px] font-mono transition-colors duration-150 ${
              selectedSize === size
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-muted"
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>

      {/* Add to Bag */}
      <motion.button
        onClick={() => {
          if (selectedSize) addItem(product, selectedSize);
        }}
        disabled={!selectedSize}
        whileTap={selectedSize ? { scale: 0.97 } : {}}
        className={`w-full mt-3 px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${
          selectedSize
            ? "bg-foreground text-background hover:bg-primary"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        Add to Bag
      </motion.button>
    </motion.div>
  );
}