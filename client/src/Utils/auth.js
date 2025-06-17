// src/utils/auth.js
export const logoutUser = async (navigate) => {
  try {
    await fetch("https://student-manager-qpdt.onrender.com/api/logout", {
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
