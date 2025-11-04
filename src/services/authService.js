import axios from "axios";

const API_URL = "http://localhost:3000/app"; // ajustá el puerto y endpoint a tu backend

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, { email, password });
    return response.data; // por ejemplo, { token, user }
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};
