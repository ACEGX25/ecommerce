"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextType {
  // Bag
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product, size: string) => Promise<void>;
  removeItem: (productId: number, size: string) => Promise<void>;
  updateQuantity: (productId: number, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;

  // Purchase (local only — no backend yet)
  purchaseItems: CartItem[];
  moveToPurchase: (productId: number, size: string) => void;
  moveAllToPurchase: () => void;
  removePurchaseItem: (productId: number, size: string) => void;
  updatePurchaseQuantity: (productId: number, size: string, quantity: number) => void;
  clearPurchase: () => void;
  totalPurchaseItems: number;
  totalPurchasePrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,         setItems]         = useState<CartItem[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<CartItem[]>([]);
  const [isOpen,        setIsOpen]        = useState(false);
  const [loading,       setLoading]       = useState(false);

  // ── Fetch cart from backend on mount ──────────────────────
  useEffect(() => {
    if (!getAccessToken()) return; // not logged in
    fetchCart();
  }, []);

  async function fetchCart() {
    setLoading(true);
    try {
      const res  = await apiFetch("/api/cart");
      const data = await res.json();
      if (res.ok && data.cart) {
        // Map backend shape → CartItem shape
        const mapped: CartItem[] = data.cart.map((item: {
          product_id: number;
          name: string;
          price: number;
          image_url: string;
          size: string;
          quantity: number;
        }) => ({
          product: {
            id:    item.product_id,
            name:  item.name,
            price: Number(item.price),
            image: item.image_url,
            size:  item.size,
          },
          size:     item.size,
          quantity: item.quantity,
        }));
        setItems(mapped);
      }
    } catch {
      // fail silently — cart stays empty
    } finally {
      setLoading(false);
    }
  }

  // ── Add item ───────────────────────────────────────────────
  const addItem = async (product: Product, size: string) => {
    // Optimistic update
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsOpen(true);

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
    } catch {
      fetchCart(); // rollback on failure
    }
  };

  // ── Remove item ────────────────────────────────────────────
  const removeItem = async (productId: number, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));

    try {
      await apiFetch(`/api/cart/${productId}`, { method: "DELETE" });
    } catch {
      fetchCart();
    }
  };

  // ── Update quantity ────────────────────────────────────────
  const updateQuantity = async (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId, size); return; }

    setItems(prev =>
      prev.map(i => i.product.id === productId && i.size === size ? { ...i, quantity } : i)
    );

    try {
      await apiFetch(`/api/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
    } catch {
      fetchCart();
    }
  };

  // ── Clear cart ─────────────────────────────────────────────
  const clearCart = async () => {
    setItems([]);
    try {
      await apiFetch("/api/cart", { method: "DELETE" });
    } catch {
      fetchCart();
    }
  };

  // ── Purchase helpers (local only) ──────────────────────────
  const moveToPurchase = (productId: number, size: string) => {
    const item = items.find(i => i.product.id === productId && i.size === size);
    if (!item) return;
    setPurchaseItems(prev => {
      const existing = prev.find(i => i.product.id === productId && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.product.id === productId && i.size === size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item }];
    });
    removeItem(productId, size);
  };

  const moveAllToPurchase = () => {
    setPurchaseItems(prev => {
      let updated = [...prev];
      for (const item of items) {
        const existing = updated.find(i => i.product.id === item.product.id && i.size === item.size);
        if (existing) {
          updated = updated.map(i =>
            i.product.id === item.product.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updated.push({ ...item });
        }
      }
      return updated;
    });
    clearCart();
  };

  const removePurchaseItem = (productId: number, size: string) =>
    setPurchaseItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));

  const updatePurchaseQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) { removePurchaseItem(productId, size); return; }
    setPurchaseItems(prev =>
      prev.map(i => i.product.id === productId && i.size === size ? { ...i, quantity } : i)
    );
  };

  const clearPurchase = () => setPurchaseItems([]);

  const totalItems         = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice         = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalPurchaseItems = purchaseItems.reduce((s, i) => s + i.quantity, 0);
  const totalPurchasePrice = purchaseItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, addItem, removeItem, updateQuantity, clearCart,
      isOpen, setIsOpen, totalItems, totalPrice,
      purchaseItems, moveToPurchase, moveAllToPurchase,
      removePurchaseItem, updatePurchaseQuantity, clearPurchase,
      totalPurchaseItems, totalPurchasePrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}