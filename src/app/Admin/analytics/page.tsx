import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dingly_access")?.value;
  if (!token) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/stats`,
    {
      cache: "no-store",
      headers: { Cookie: `dingly_access=${token}` },
    }
  );

  if (!res.ok) redirect("/login");
  const json = await res.json();
  return json.data.userGrowth as { date: string; count: string }[];
}

export default async function AdminAnalyticsPage() {
  const growth = await getStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">User registrations — last 7 days</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-3 px-4 text-gray-500 font-medium">Date</th>
              <th className="pb-3 px-4 text-gray-500 font-medium">New Users</th>
            </tr>
          </thead>
          <tbody>
            {growth.map((row) => (
              <tr key={row.date} className="border-b border-gray-50">
                <td className="py-3 px-4 text-gray-700">{row.date}</td>
                <td className="py-3 px-4 font-semibold text-gray-900">{row.count}</td>
              </tr>
            ))}
            {growth.length === 0 && (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-400">
                  No data for the last 7 days
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}