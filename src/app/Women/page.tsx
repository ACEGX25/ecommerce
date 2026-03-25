"use client";

import { motion, Variants } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { fetchAllWomen, WomenProduct } from "@/lib/women";

const gridVariants = {
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

export default function WomenPage() {
  const [products, setProducts] = useState<WomenProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllWomen()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground tracking-wide">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const mappedProducts = products.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: Number(p.price),
    image: p.image_url || "/assets/placeholder.jpg",
    category: "women" as const,
    material: p.description || "",
    weight: "",
    fit: "",
    sizes: p.size ? [p.size] : ["XS", "S", "M", "L"],
  }));

  return (
    <div className="pt-16 min-h-screen">
      <motion.div
        className="border-b px-4 md:px-8 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">WOMEN</h1>
        <p className="text-sm text-muted-foreground mt-2 tracking-wide">
          {mappedProducts.length} items — Precision in every stitch
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-0"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {mappedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variants={cardVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}