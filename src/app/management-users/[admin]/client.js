"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/adminComponents/Sidebar";
import { FiEdit, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://duanol.mitsubishi-training.my.id/api/v1/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Gagal mengambil user:", error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUserId
        ? `https://duanol.mitsubishi-training.my.id/api/v1/users/${editingUserId}`
        : "https://duanol.mitsubishi-training.my.id/api/v1/users";
      const method = editingUserId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          editingUserId
            ? { full_name: formData.full_name }
            : formData
        ),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan data");
      }

      // Reset form
      setFormData({
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setEditingUserId(null);

      // Ambil ulang data user
      const resUsers = await fetch(
        "https://duanol.mitsubishi-training.my.id/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const usersData = await resUsers.json();
      setUsers(usersData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingUserId(user.id_user);
  };

  const handleDelete = async (id_user) => {
    // Gunakan `id_user` bukan `id`
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak valid!");

      const res = await fetch(
        `https://duanol.mitsubishi-training.my.id/api/v1/users/${id_user}`,
        {
          // Pastikan URL benar
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus user");
      }

      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error saat delete:", error.message);
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      <div className="flex-1 p-8 ml-0 lg:ml-30">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 backdrop-blur-sm bg-opacity-90">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            User Management
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-300"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* User Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-8 p-4 bg-red-50 rounded-lg border border-red-100"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {editingUserId ? "Edit User" : "Create New User"}
            </h2>
            <input
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300"
              required
            />
            {!editingUserId && (
              <>
                <input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  required
                  disabled={!!editingUserId} // Disable username saat edit
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  required={!editingUserId} // Hanya required saat create
                />
                <input
                  name="role"
                  type="text"
                  value="user"
                  readOnly
                  className="border border-gray-300 px-4 py-2 w-full rounded-lg bg-gray-100 text-gray-500"
                />
              </>
            )}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {editingUserId ? "Update User" : "Create User"}
            </button>
            {editingUserId && (
              <button
                type="button"
                onClick={() => {
                  setEditingUserId(null);
                  setFormData({
                    full_name: "",
                    username: "",
                    email: "",
                    password: "",
                    role: "user",
                  });
                }}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    #
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    Full Name
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    Username
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    Email
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    Role
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    // Create a fallback key using index if ID is missing
                    const userId = user.id || user._id || `temp-${index}`;
                    return (
                      <tr
                        key={`user-${userId}`}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 text-gray-600">{user.full_name}</td>
                        <td className="p-3 text-gray-600">{user.username}</td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                        <td className="p-3 text-gray-600 capitalize">
                          {user.role}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id_user)} // Gunakan `user.id_user`
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
