import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-bold text-blue-600">⚙️ Hệ thống quản trị</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Đăng xuất
      </button>
    </header>
  );
}
