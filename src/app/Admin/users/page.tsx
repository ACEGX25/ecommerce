import UsersTable from "../components/UsersTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

async function getUsers(search = "", role = "", page = 1) {
  const cookieStore = await cookies();
  const token = cookieStore.get("dingly_access")?.value;

  if (!token) redirect("/login");

  const params = new URLSearchParams({
    search,
    role,
    page: String(page),
    limit: "20",
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/users?${params}`,
    {
      cache: "no-store",
      headers: {
        Cookie: `dingly_access=${token}`,
      },
    }
  );

  if (!res.ok) redirect("/login");

  const json = await res.json();
  return json.data as {
    users: User[];
    pagination: { total: number; totalPages: number; page: number };
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; page?: string }>;
}) {
  const sp     = await searchParams;
  const { users, pagination } = await getUsers(
    sp.search ?? "",
    sp.role   ?? "",
    Number(sp.page ?? 1)
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total users
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <UsersTable users={users} />

        {/* Pagination info */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-400">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
}