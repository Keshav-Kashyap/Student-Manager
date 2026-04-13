import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import MobileNavigation from "../components/MobileNavigation";
import { UserManager } from "../Utils/UserManager";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthContext from "@/context/AuthContext";

const AuthenticatedLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (loading) {
        return (
            <div className="w-100 h-100 bg-black">

                "Loading..."
            </div>
        )
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 76)",
                "--header-height": "4rem",
            }}
        >
            <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
                <AppSidebar variant="inset" className="md:top-0 md:h-svh" />

                <SidebarInset className="min-w-0 bg-transparent md:m-0 md:rounded-none md:shadow-none">
                    {/* <div className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur">
                        <Navbar user={user} embedded />
                    </div> */}

                    <div className="fixed right-4 top-20 z-40 hidden md:block">
                        <SidebarTrigger className="h-10 w-10 rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur hover:bg-white" />
                    </div>

                    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
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
            </div>
        </SidebarProvider>
    );
};

export default AuthenticatedLayout;
