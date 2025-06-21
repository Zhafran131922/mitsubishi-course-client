const API_BASE_URL = "https://duanol.mitsubishi-training.my.id";

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} response data with token and user info
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
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
    const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/auth/login", {
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
    const res = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
      const token = localStorage.getItem("token");
      const response = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/program`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch programs");
      const data = await response.json();
      return data.data; // <--- penting!
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/program", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Jangan set Content-Type kalau pakai FormData
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create program");
      return await response.json();
    } catch (error) {
      console.error("Error creating program:", error);
      throw error;
    }
  },

  // Update a program
  update: async (id, programData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://duanol.mitsubishi-training.my.id/api/v1/program/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(programData),
        }
      );
      if (!response.ok) throw new Error("Failed to update program");
      return await response.json();
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  },

  // Delete a program
  delete: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://duanol.mitsubishi-training.my.id/api/v1/program/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete program");
      return await response.json();
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
};

// src/api.js

export async function fetchProgramById(id) {
  try {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    const response = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/program/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Sertakan token di header
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data program berdasarkan ID");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("fetchProgramById error:", error);
    return null;
  }
}

export const fetchMaterials = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/topics", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data materials");
    }

    const json = await res.json();
    const dataArray = Array.isArray(json) ? json : json.data;

    return Array.isArray(dataArray) ? dataArray : [];
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return []; // jangan return [null], return array kosong saja
  }
};

// api.js

export const createTopic = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/topics/", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal membuat topik");
    }

    return data.data; // return only the topic data
  } catch (error) {
    throw error;
  }
};

export const createMaterial = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/materials/", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal membuat material");
    }

    return data.data; // return only the topic data
  } catch (error) {
    throw error;
  }
};

export const getMaterialByTopicId = async (topicId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan");

    const res = await fetch(
      `https://duanol.mitsubishi-training.my.id/api/v1/materials/${topicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal memuat materi");

    return data.data;
  } catch (err) {
    throw err;
  }
};

export async function getTopicById(topicId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan");

    const res = await fetch(`https://duanol.mitsubishi-training.my.id/api/v1/topics/${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal memuat topik");

    return data.data; // pastikan ini sesuai dengan struktur response
  } catch (err) {
    throw err;
  }
}

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await response.json();
  return data.data;
};

export const deleteTopic = async (id_topic) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(
    `https://duanol.mitsubishi-training.my.id/api/v1/topics/${id_topic}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete topic");
  }

  return true;
};

// api.js
export const createTopicWithMaterials = async (formData, token) => {
  const authToken = token || localStorage.getItem("token");
  if (!authToken) {
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  // 1. Create Topic
  const topicForm = new FormData();
  topicForm.append("title", formData.title);
  topicForm.append("level", formData.level);
  topicForm.append("id_user", formData.idUser);
  topicForm.append("duration", formData.duration);
  topicForm.append("picture", formData.picture);
  topicForm.append("deadline", formData.deadline);

  const topicRes = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/topics", {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: topicForm,
  });

  if (!topicRes.ok) {
    const errorData = await topicRes.json();
    throw new Error(errorData.message || "Gagal membuat topik");
  }

  const topicData = await topicRes.json();
  const topicId = topicData.data.id_topic;

  // 2. Create Materials
  const materialCreationPromises = formData.materials.map(async (material) => {
    const materialForm = new FormData();
    materialForm.append("topicId", topicId);
    materialForm.append("title", material.title);
    materialForm.append("url_link", material.urlLink);
    materialForm.append("overview", material.overview);
    material.modules.forEach((module) => materialForm.append("module", module));

    const materialRes = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/materials", {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: materialForm,
    });

    if (!materialRes.ok) {
      const errorData = await materialRes.json();
      throw new Error(errorData.message || "Gagal membuat material");
    }

    return await materialRes.json();
    
  });

  await Promise.all(materialCreationPromises);

  return topicData; // optional: return data topik
};

export const createProgram = async (form, tokenProp) => {
  const token = tokenProp || localStorage.getItem("token") || "";

  const formData = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (key === "url_link" && form.status !== "online") return;
    if (key === "content") {
      if (val) formData.append("content", val);
    } else {
      formData.append(key, val);
    }
  });

  const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/program", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Gagal menambah program");
  }

  return await response.json(); // jika ingin gunakan responnya
};

export const getQuizByMaterialId = async (materialId, tokenProp) => {
  const token = tokenProp || localStorage.getItem("token");

  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(
    `https://duanol.mitsubishi-training.my.id/api/v1/quiz/materials/${materialId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal mengambil quiz untuk material ID ${materialId}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Format data quiz tidak valid");
  }

  return data;
};

export const getMaterialsAndTopics = async (tokenProp) => {
  const token = tokenProp || localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const [materialsRes, topicsRes] = await Promise.all([
    fetch("https://duanol.mitsubishi-training.my.id/api/v1/materials", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("https://duanol.mitsubishi-training.my.id/api/v1/topics", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!materialsRes.ok) throw new Error("Gagal mengambil data materi");
  if (!topicsRes.ok) throw new Error("Gagal mengambil data topic");

  const materialsData = await materialsRes.json();
  const topicsData = await topicsRes.json();

  return {
    materials: materialsData.data,
    topics: topicsData.data,
  };
};

export const createQuiz = async (quiz, tokenProp) => {
  const token = tokenProp || localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const payload = {
    question: quiz.question,
    idMaterial: Number(quiz.idMaterial),
    answers: quiz.answers,
  };

  const res = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Gagal membuat quiz");
  }

  return await res.json();
};

export const markMaterialAsDone = async ({ id_user, id_material, isDone = true }, tokenProp) => {
  const token = tokenProp || localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/materials/markdone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_user,
      id_material,
      isDone,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Gagal menandai materi sebagai selesai");
  }

  return await response.json();
};

export const requestPasswordReset = async (email) => {
  const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan saat reset password.");
  }

  return data; // opsional: return message atau status
};



