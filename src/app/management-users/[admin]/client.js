"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/adminComponents/Sidebar";
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiMenu, FiX } from "react-icons/fi";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

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

  useEffect(() => {
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

      setFormData({
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error(error.message);
      alert(`Error: ${error.message}`);
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
    if (isMobile) {
      // Scroll to form on mobile when editing
      document.getElementById("user-form").scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id_user) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak valid!");

      const res = await fetch(
        `https://duanol.mitsubishi-training.my.id/api/v1/users/${id_user}`,
        {
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

      fetchUsers();
    } catch (error) {
      console.error("Error saat delete:", error.message);
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Mobile sidebar toggle button */}

      {/* Sidebar - hidden on mobile when closed */}
      <div 
        className={`fixed md:static z-40 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'left-0' : '-left-full'
        } md:left-0`}
      >
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white h-full" />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 p-4 md:p-8 ml-0 lg:ml-30 mt-20 md:mt-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
            User Management
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
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
              <FiFilter className="text-gray-500 hidden md:block" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto focus:ring-2 focus:ring-red-100 focus:border-red-300"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* User Form */}
          <form
            id="user-form"
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-4 mb-6 md:mb-8 p-3 md:p-4 bg-red-50 rounded-lg border border-red-100"
          >
            <h2 className="text-base md:text-lg font-semibold text-gray-700">
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
                  disabled={!!editingUserId}
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
                  required={!editingUserId}
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
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base"
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
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm md:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Users Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
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
                              onClick={() => handleDelete(user.id_user)}
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

          {/* Users List - Mobile */}
          <div className="md:hidden space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">User List</h3>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div 
                  key={`mobile-user-${user.id_user}`} 
                  className="bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{user.full_name}</h4>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id_user)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="truncate">{user.email}</p>
                    <p className="mt-1">
                      <span className="font-medium">Role:</span> <span className="capitalize">{user.role}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500 bg-white rounded-lg border border-gray-200">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;