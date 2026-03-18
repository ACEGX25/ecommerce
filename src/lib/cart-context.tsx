"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./products";

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextType {
  // Bag
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;

  // Purchase
  purchaseItems: CartItem[];
  moveToPurchase: (productId: string, size: string) => void;
  moveAllToPurchase: () => void;
  removePurchaseItem: (productId: string, size: string) => void;
  updatePurchaseQuantity: (productId: string, size: string, quantity: number) => void;
  clearPurchase: () => void;
  totalPurchaseItems: number;
  totalPurchasePrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const moveToPurchase = (productId: string, size: string) => {
    const item = items.find(
      (i) => i.product.id === productId && i.size === size
    );
    if (!item) return;

    setPurchaseItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === productId && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
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
    setPurchaseItems((prev) => {
      let updated = [...prev];
      for (const item of items) {
        const existing = updated.find(
          (i) => i.product.id === item.product.id && i.size === item.size
        );
        if (existing) {
          updated = updated.map((i) =>
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

  const removePurchaseItem = (productId: string, size: string) => {
    setPurchaseItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  };

  const updatePurchaseQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removePurchaseItem(productId, size);
      return;
    }
    setPurchaseItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearPurchase = () => setPurchaseItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const totalPurchaseItems = purchaseItems.reduce(
    (sum, i) => sum + i.quantity,
    0
  );
  const totalPurchasePrice = purchaseItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        purchaseItems,
        moveToPurchase,
        moveAllToPurchase,
        removePurchaseItem,
        updatePurchaseQuantity,
        clearPurchase,
        totalPurchaseItems,
        totalPurchasePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
