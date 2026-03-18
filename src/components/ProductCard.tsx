"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div
      className="product-cell group relative"
      onMouseEnter={() => setShowSpecs(true)}
      onMouseLeave={() => setShowSpecs(false)}
    >
      <div className="relative aspect-square overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {showSpecs && (
          <div className="absolute bottom-0 left-0 bg-foreground/90 text-background p-2 text-[10px] font-mono leading-relaxed">
            <div>[Material: {product.material}]</div>
            <div>[Weight: {product.weight}]</div>
            <div>[Fit: {product.fit}]</div>
          </div>
        )}
      </div>
      <h3 className="heading-l2 text-sm">{product.name}</h3>
      <p className="meta-text text-primary mt-1">${product.price.toFixed(2)}</p>

      {/* Size picker */}
      <div className="flex gap-1 mt-3">
        {product.sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`border px-2 py-1 text-[11px] font-mono transition-colors duration-150 ${
              selectedSize === size
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-muted"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          if (selectedSize) addItem(product, selectedSize);
        }}
        disabled={!selectedSize}
        className={`w-full mt-3 px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${
          selectedSize
            ? "bg-foreground text-background hover:bg-primary"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        Add to Bag
      </button>
    </div>
  );
}
