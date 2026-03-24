"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin",           label: "Dashboard" },
  { href: "/admin/users",     label: "Users"     },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-56 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-700">
        <span className="text-white font-semibold text-lg">Admin Panel</span>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              pathname === link.href
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}