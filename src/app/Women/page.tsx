"use client";

import { motion,Variants } from "framer-motion";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

// Parent controls the stagger timing
const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08, // each card waits 80ms after the previous
    },
  },
};

// Each card's entrance — this overrides the card's own initial/animate
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} satisfies Variants;

export default function WomenPage() {
  const womenProducts = products.filter((p) => p.category === "women");

  return (
    <div className="pt-16 min-h-screen">
      {/* Heading fade in */}
      <motion.div
        className="border-b px-4 md:px-8 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">WOMEN</h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          {womenProducts.length} items — Precision in every stitch
        </p>
      </motion.div>

      {/* Grid — parent orchestrates stagger */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-0"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {womenProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variants={cardVariants} // card receives the variant from parent
          />
        ))}
      </motion.div>
    </div>
  );
}