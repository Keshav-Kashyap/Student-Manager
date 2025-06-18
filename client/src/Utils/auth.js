// src/utils/auth.js
import { API_BASE } from "../config/api";
export const logoutUser = async (navigate) => {
  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include", // Include cookies if used
    });

    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token if using

    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
