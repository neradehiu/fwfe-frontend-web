import { useState } from "react";
import { createUser } from "../../services/accountService";

const CreateUserForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ROLE_USER" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(form);
      alert("Tạo người dùng thành công!");
      setForm({ name: "", email: "", password: "", role: "ROLE_USER" });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Tạo người dùng mới</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_MANAGER">Manager</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo người dùng"}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
