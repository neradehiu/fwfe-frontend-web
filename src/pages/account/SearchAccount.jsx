import { useState } from "react";
import { searchUsers } from "../../services/accountService";

const SearchAccount = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await searchUsers(keyword);
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tìm kiếm người dùng</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nhập tên hoặc email..."
          className="border p-2 rounded w-full"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded">
          Tìm
        </button>
      </div>

      <ul>
        {results.map(user => (
          <li key={user.id} className="border-b py-2">
            {user.name} - {user.email}
          </li>
        ))}
        {results.length === 0 && <li>Không có kết quả</li>}
      </ul>
    </div>
  );
};

export default SearchAccount;
