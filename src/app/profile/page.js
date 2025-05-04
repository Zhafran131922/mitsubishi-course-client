"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    position: "Senior Developer",
    department: "Engineering",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add your save logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Sidebar />

      <div className="flex-1 p-6 lg:ml-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-64">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">
                  Account Settings
                </h2>

                <nav className="space-y-2">
                  {[
                    { id: "profile", label: "Profile Information", icon: "👤" },
                    { id: "security", label: "Security", icon: "🔒" },
                    { id: "notifications", label: "Notifications", icon: "🔔" },
                    { id: "billing", label: "Billing", icon: "💳" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Profile Header */}
                  <div className="border-b border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Profile Information
                      </h3>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Profile Picture */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                          <Image
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Upload New
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-800">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Form Fields */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Position
                          </label>
                          <input
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={3}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              isEditing
                                ? "border-gray-300"
                                : "border-transparent bg-gray-50"
                            }`}
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">Human Resources</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Security Settings
                  </h3>

                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500">
                            Add extra security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
