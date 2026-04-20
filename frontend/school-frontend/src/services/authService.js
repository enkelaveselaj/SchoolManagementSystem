import axios from "axios";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:5001";

export const authService = {
  register: async ({ first_name, last_name, email, password }) => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/auth/register`, {
      first_name,
      last_name,
      email,
      password,
    });
    return response.data;
  },

  login: async ({ email, password }) => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
};

export default authService;
