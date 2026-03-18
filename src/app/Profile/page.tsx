"use client";

import Link from "next/link";
import { Package, User, MapPin, CreditCard } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b px-4 md:px-8 py-6">
        <h1 className="heading-l1 text-[clamp(2rem,5vw,4rem)]">ACCOUNT</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        {/* User info */}
        <div className="border p-6 mb-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="heading-l2">Guest User</p>
              <p className="text-sm text-muted-foreground">guest@prima.com</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="border border-t-0">
          <Link
            href="/orders"
            className="flex items-center gap-4 p-4 border-b hover:bg-muted transition-colors duration-150"
          >
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Order History</p>
              <p className="text-xs text-muted-foreground">
                View past orders and track shipments
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>

          <button className="w-full flex items-center gap-4 p-4 border-b hover:bg-muted transition-colors duration-150 text-left">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Addresses</p>
              <p className="text-xs text-muted-foreground">
                Manage delivery addresses
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>

          <button className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors duration-150 text-left">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Payment Methods</p>
              <p className="text-xs text-muted-foreground">
                Manage saved cards
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}