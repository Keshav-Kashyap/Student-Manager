import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

const AuthContext = createContext();
const USER_STORAGE_KEY = "user";

const safeParseUser = () => {
    try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to parse cached user:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => safeParseUser());
    const [loading, setLoading] = useState(true);

    //  fetch user once
    const fetchUser = async () => {
        const cachedUser = safeParseUser();

        if (cachedUser) {
            setUser(cachedUser);
            setLoading(false);
            return cachedUser;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/profile`, {
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.data));
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
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
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
            localStorage.removeItem(USER_STORAGE_KEY);
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