import StatCard from "./components/StatCard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  newThisMonth: number;
};

async function getDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("dingly_access")?.value;

  if (!token) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/dashboard`,
    {
      cache: "no-store",
      headers: {
        Cookie: `dingly_access=${token}`,
      },
    }
  );

  if (!res.ok) redirect("/login");

  const json = await res.json();
  return json.data;
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here is what is happening.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users"     value={data.totalUsers}   />
        <StatCard label="Active Users"    value={data.activeUsers}  />
        <StatCard label="Admins"          value={data.adminCount}   />
        <StatCard label="New This Month"  value={data.newThisMonth} />
      </div>
    </div>
  );
}