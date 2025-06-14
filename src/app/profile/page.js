'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function UserProfilePage() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    phone_number: '',
    position: '',
    address: '',
    profile_picture: null,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [previewImage, setPreviewImage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Ambil ID dari token
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.id) {
        setUserId(decoded.id);
      }
    }
  }, [token]);

  // Fetch data user
  useEffect(() => {
    if (!token || !userId) return;

    fetch(`https://duanol.mitsubishi-training.my.id/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setProfileForm({
          phone_number: data.profile?.phone_number || '',
          position: data.profile?.position || '',
          address: data.profile?.address || '',
          profile_picture: null,
        });
      })
      .catch(() => setMessage('Gagal mengambil data pengguna.'));
  }, [token, userId]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('phone_number', profileForm.phone_number);
    formData.append('position', profileForm.position);
    formData.append('address', profileForm.address);
    if (profileForm.profile_picture) {
      formData.append('profile_picture', profileForm.profile_picture);
    }

    try {
      const res = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui profil');
      setMessage('Profil berhasil diperbarui!');
      // Refresh user data
      const userRes = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userRes.json();
      setUser(userData);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/users/password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui password');
      setMessage('Password berhasil diperbarui!');
      setTimeout(() => setMessage(''), 3000);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileForm({ ...profileForm, profile_picture: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-red-500">
        {/* Racing-inspired header */}
        <div className="bg-white p-6 border-b border-gray-200 relative">
          <div className="absolute top-0 left-0 h-full w-1 bg-red-500"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            <span className="text-red-500">PRO</span>FILE SETTINGS
          </h1>
          <p className="text-gray-600 mt-1">Manage your account details</p>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm md:text-base flex-1 text-center ${activeTab === 'profile' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium text-sm md:text-base flex-1 text-center ${activeTab === 'password' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Change Password
          </button>
        </div>

        {/* Message display */}
        {message && (
          <div className={`px-6 py-3 ${message.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Profile Form */}
        <div className={`p-6 ${activeTab === 'profile' ? 'block' : 'hidden'}`}>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture Section */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-red-500 mb-4">
                  {previewImage ? (
                    <Image 
                      src={previewImage} 
                      alt="Profile preview" 
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : user?.profile?.profile_picture ? (
                    <Image 
                      src={`https://duanol.mitsubishi-training.my.id/uploads/${user.profile.profile_picture.split("/").pop()}`}
                      alt="Profile picture"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                    Change Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info Section */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+62 123 4567 890"
                      value={profileForm.phone_number}
                      onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Your position"
                      value={profileForm.position}
                      onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Your full address"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    UPDATE PROFILE
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Password Form */}
        <div className={`p-6 ${activeTab === 'password' ? 'block' : 'hidden'}`}>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                CHANGE PASSWORD
              </button>
            </div>
          </form>
        </div>

        {/* Racing-inspired footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="text-xs text-gray-500">
              ACCOUNT SECURITY: {activeTab === 'profile' ? 'PROFILE' : 'PASSWORD'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}