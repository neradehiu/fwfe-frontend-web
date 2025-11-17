import { useState } from "react";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", code: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(form);
      alert("Đổi mật khẩu thành công!");
      setForm({ email: "", code: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mã xác nhận"
          className="border p-2 rounded"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          className="border p-2 rounded"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
