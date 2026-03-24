"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";

export function Header() {
  const { totalItems, setIsOpen, totalPurchaseItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredProducts = searchQuery.length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background flex items-center px-4 md:px-8"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Left — logo + nav */}
      <div className="flex items-center gap-6 flex-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href="/" className="heading-l1 text-xl tracking-[-0.05em]">
            PRIMA
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-6">
          {["men", "women"].map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
            >
              <Link
                href={`/${cat}`}
                className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors duration-150"
              >
                {cat}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Centre — search */}
      <motion.div
        className="flex-1 max-w-md mx-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-open"
              className="relative"
              initial={{ opacity: 0, scaleX: 0.95 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-muted border-none px-4 py-2 text-sm focus:outline-none focus:ring-0"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Dropdown results */}
              <AnimatePresence>
                {filteredProducts.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 bg-background border border-t-0 z-50"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredProducts.map((p) => (
                      <motion.button
                        key={p.id}
                        whileHover={{ backgroundColor: "var(--muted)" }}
                        onClick={() => {
                          router.push(`/${p.category}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors duration-150 text-left"
                      >
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover" />
                        <div>
                          <p className="heading-l2 text-sm">{p.name}</p>
                          <p className="meta-text text-primary">${p.price.toFixed(2)}</p>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              key="search-closed"
              onClick={() => setSearchOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full flex items-center gap-2 bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors duration-150"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right — icons */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Link href="/profile" className="hover:text-primary transition-colors duration-150">
            <User className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Bag */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="relative hover:text-primary transition-colors duration-150"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-mono w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Purchase */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Link href="/purchase" className="relative hover:text-primary transition-colors duration-150">
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {totalPurchaseItems > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-mono w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {totalPurchaseItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}