const API_BASE_URL = "http://localhost:3001/api/v1";

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} response data with token and user info
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login gagal. Periksa kembali email dan password.");
    }

    const data = await response.json();
    return data; // { data: { username, role }, access_token, message }
  } catch (error) {
    throw error;
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// api.js
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3001/api/v1/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();

    const users = data
      .filter((u) => u.role === "user")
      .map((user, index) => ({
        name: user.full_name || user.username,
        username: user.username,
        schedule: generateRandomSchedule(),
        avatar: getInitials(user.full_name || user.username),
        color: getColorByIndex(index),
      }));

    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};


const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);

const generateRandomSchedule = () => {
  const days = [1, 2, 3, 4, 5, 6, 7];
  return days.filter(() => Math.random() > 0.5);
};

const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500"];
const getColorByIndex = (i) => colors[i % colors.length];


export const ProgramAPI = {
  // Get all programs
// Get all programs
getAll: async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/v1/program`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch programs');
    const data = await response.json();
    return data.data; // <--- penting!
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
},

create: async (formData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3001/api/v1/program', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Jangan set Content-Type kalau pakai FormData
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to create program');
    return await response.json();
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
},


  // Update a program
  update: async (id, programData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/program/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(programData),
      });
      if (!response.ok) throw new Error('Failed to update program');
      return await response.json();
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },

  // Delete a program
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/v1/program/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete program');
      return await response.json();
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  },
};

// src/api.js

export async function fetchProgramById(id) {
  try {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

    const response = await fetch(`http://localhost:3001/api/v1/program/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Sertakan token di header
      }
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data program berdasarkan ID');
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('fetchProgramById error:', error);
    return null;
  }
}

export const fetchMaterials = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/api/v1/topics", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : "",
      }
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data materials');
    }

    const json = await res.json();
    const dataArray = Array.isArray(json) ? json : json.data;

    return Array.isArray(dataArray) ? dataArray : [];
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return [];  // jangan return [null], return array kosong saja
  }
};

// api.js

export const createTopic = async formData => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch('http://localhost:3001/api/v1/topics/', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal membuat topik');
    }

    return data.data; // return only the topic data
  } catch (error) {
    throw error;
  }
};

export const createMaterial = async formData => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch('http://localhost:3001/api/v1/materials/', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal membuat material');
    }

    return data.data; // return only the topic data
  } catch (error) {
    throw error;
  }
};

export const getMaterialByTopicId = async (topicId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token tidak ditemukan');

    const res = await fetch(`http://localhost:3001/api/v1/materials/${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat materi');

    return data.data;
  } catch (err) {
    throw err;
  }
};

export async function getTopicById(topicId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token tidak ditemukan');

    const res = await fetch(`http://localhost:3001/api/v1/topics/${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat topik');

    return data.data; // pastikan ini sesuai dengan struktur response
  } catch (err) {
    throw err;
  }
}

