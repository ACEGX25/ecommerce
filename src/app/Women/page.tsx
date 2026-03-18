"use client";

import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function WomenPage() {
  const womenProducts = products.filter((p) => p.category === "women");
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">WOMEN</h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          {womenProducts.length} items — Precision in every stitch
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {womenProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
