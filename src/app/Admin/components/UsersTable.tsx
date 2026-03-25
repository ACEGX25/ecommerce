type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-3 px-4 text-gray-500 font-medium">Name</th>
            <th className="pb-3 px-4 text-gray-500 font-medium">Email</th>
            <th className="pb-3 px-4 text-gray-500 font-medium">Role</th>
            <th className="pb-3 px-4 text-gray-500 font-medium">Status</th>
            <th className="pb-3 px-4 text-gray-500 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
              <td className="py-3 px-4 text-gray-500">{user.email}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(user.created_at).toLocaleDateString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}