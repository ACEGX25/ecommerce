"use client";

import { motion, Variants } from "framer-motion";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
} satisfies Variants;

const MenPage = () => {
  const menProducts = products.filter((p) => p.category === "men");

  return (
    <div className="pt-16 min-h-screen">
      {/* Heading fade in */}
      <motion.div
        className="px-4 md:px-8 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">MEN</h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          {menProducts.length} items — Engineered basics for daily wear
        </p>
      </motion.div>

      {/* Grid — parent orchestrates stagger */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 pb-8"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {menProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variants={cardVariants}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default MenPage;