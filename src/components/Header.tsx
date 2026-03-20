"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, ShoppingCart, X } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background flex items-center px-4 md:px-8">
      <div className="flex items-center gap-6 flex-1">
        <Link href="/" className="heading-l1 text-xl tracking-[-0.05em]">
          PRIMA
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/men"
            className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors duration-150"
          >
            Men
          </Link>
          <Link
            href="/women"
            className="text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors duration-150"
          >
            Women
          </Link>
        </nav>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto relative">
        {searchOpen ? (
          <div className="relative">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-muted border-none px-4 py-2 text-sm focus:outline-none focus:ring-0"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            {filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-background border border-t-0 z-50">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/${p.category}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors duration-150 text-left"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover"
                    />
                    <div>
                      <p className="heading-l2 text-sm">{p.name}</p>
                      <p className="meta-text text-primary">${p.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors duration-150"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <Link href="/profile" className="hover:text-primary transition-colors duration-150">
          <User className="h-5 w-5" />
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="relative hover:text-primary transition-colors duration-150"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-mono w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <Link
          href="/purchase"
          className="relative hover:text-primary transition-colors duration-150"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalPurchaseItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-mono w-4 h-4 flex items-center justify-center">
              {totalPurchaseItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}