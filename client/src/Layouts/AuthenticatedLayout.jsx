import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNavigation from "../components/MobileNavigation";
import SurajPrintingLoader from "../components/common/loader";
import { UserManager } from "../Utils/UserManager";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AuthenticatedLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setLoading(false);
            return;
        }

        const loadUserData = () => {
            try {
                const savedUser = UserManager.getSavedUser();
                if (savedUser) {
                    setUser(savedUser);
                } else {
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                UserManager.clearUser();
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }

        return undefined;
    }, []);

    if (loading) {
        return ( 
            <div className="w-100 h-100 bg-black">
            
            "Loading..."
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar user={user} />

            <div className="flex flex-1 overflow-hidden pt-16">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    className="h-[calc(100vh-64px)]"
                    user={user}
                /> */}

        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                }
            }
        >

             <AppSidebar variant="inset" />

                    <SidebarInset>
                <main
                    className={`flex-1 p-0 overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-80" : "lg:ml-0"
                        }`}
                >
                    <Outlet
                        context={{
                            user,
                            setUser: UserManager.saveUser,
                            clearUser: UserManager.clearUser,
                        }}
                    />
                    <MobileNavigation />
                </main>
                        </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
};

export default AuthenticatedLayout;
