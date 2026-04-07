import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //  fetch user once
    const fetchUser = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/users/profile`, {
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth fetch error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    //  run once on app load
    useEffect(() => {
        fetchUser();
    }, []);

    //  login helper
    const login = (userData) => {
        setUser(userData);
    };

    //  logout helper
    const logout = async () => {
        try {
            await fetch(`${API_BASE}/api/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;