import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prima",
  description: "Engineered basics for daily wear",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <CartProvider>
          <Header />
          <CartDrawer />  {/* ← this was missing! */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}