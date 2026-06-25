"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8003/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Quản lý người dùng</h1>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Tên</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Chưa có người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-400/10 text-purple-400"
                            : "bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
