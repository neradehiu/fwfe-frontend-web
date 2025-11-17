import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import AdminSidebar from "./AdminSidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`flex h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main
          className={`flex-1 p-6 overflow-auto transition-colors ${
            darkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
