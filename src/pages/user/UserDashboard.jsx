import { useEffect, useState } from "react";
import { getAllWorks, getWork } from "../../services/workService.js";
import { acceptWork, getAcceptedJobsByStatus } from "../../services/workAcceptanceService.js";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const accountId = Number(localStorage.getItem("accountId")) || null;

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  // Load jobs và đánh dấu job đã nhận
  const loadJobs = async () => {
    try {
      const data = await getAllWorks();

      const enriched = await Promise.all(
        data.map(async (job) => {
          let hasAccepted = false;
          if (accountId) {
            const acceptedJobs = await getAcceptedJobsByStatus(job.id, "PENDING");
            hasAccepted = acceptedJobs.length > 0;
          }
          return { ...job, hasAccepted };
        })
      );

      setJobs(enriched);
      setFilteredJobs(enriched);
    } catch (err) {
      console.error("Lỗi load công việc:", err);
      alert("Lỗi tải danh sách công việc!");
    }
  };

  // Search jobs
  const filterJobs = (text) => {
    setSearch(text);
    const lower = text.toLowerCase();
    const newList = jobs.filter(
      (job) =>
        job.position.toLowerCase().includes(lower) ||
        job.company.toLowerCase().includes(lower)
    );
    setFilteredJobs(newList);
  };

  // Nhận việc
  const handleAcceptWork = async (job, index = null) => {
    if (!accountId) {
      alert("Không xác định được accountId!");
      return;
    }

    if (index !== null) setLoadingIndex(index);
    else setModalLoading(true);

    try {
      const res = await acceptWork(job.id, {
        note: "Mình muốn nhận việc này",
        salaryExpected: job.salary || 0,
      });

      if (res) {
        // Cập nhật trạng thái job trong list
        const updatedJobs = jobs.map((j) =>
          j.id === job.id ? { ...j, hasAccepted: true } : j
        );
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);

        // Nếu modal mở, cập nhật modal state
        if (selectedJob && selectedJob.id === job.id) {
          setSelectedJob({ ...selectedJob, hasAccepted: true });
        }

        alert("Nhận việc thành công!");
      } else {
        alert("Không thể nhận việc. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi nhận việc:", err);
      alert("Lỗi khi nhận việc. Vui lòng thử lại.");
    } finally {
      if (index !== null) setLoadingIndex(null);
      else setModalLoading(false);
    }
  };

  // Mở modal chi tiết (fetch từ API)
  const openModal = async (job) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const data = await getWork(job.id);
      // Merge trạng thái đã nhận nếu có
      let hasAccepted = false;
      if (accountId) {
        const acceptedJobs = await getAcceptedJobsByStatus(job.id, "PENDING");
        hasAccepted = acceptedJobs.length > 0;
      }
      setSelectedJob({ ...data, hasAccepted });
    } catch (err) {
      console.error("Lỗi khi fetch chi tiết công việc:", err);
      alert("Không thể tải chi tiết công việc!");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowModal(false);
  };

  const handleManagerClick = () => navigate("/manager/interface");
  const handleAdminClick = () => navigate("/admin/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Xin chào, {username ?? "Guest"}
          </h1>
          <span className="text-lg font-semibold text-white">TÌM VIỆC 24H</span>
        </div>

        {/* Search bar */}
        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => filterJobs(e.target.value)}
            placeholder="Tìm kiếm công việc..."
            className="w-full p-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
          />
        </div>
      </div>

      {/* Job List */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Việc làm mới nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id || index}
              className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-indigo-500 hover:scale-[1.03] transition-transform cursor-pointer"
            >
              <h3 className="text-xl font-bold text-indigo-600">{job.position}</h3>
              <p className="mt-1 text-gray-600">Công ty: {job.company}</p>
              <p className="text-gray-600">Lương: {job.salary} VNĐ</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    job.hasAccepted
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.hasAccepted ? "Đã nhận việc" : "Chưa nhận"}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
                  onClick={() => openModal(job)}
                >
                  Chi tiết
                </button>

                {!job.hasAccepted && (
                  <button
                    className={`px-4 py-2 rounded-lg shadow text-white ${
                      loadingIndex === index
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={loadingIndex === index}
                    onClick={() => handleAcceptWork(job, index)}
                  >
                    {loadingIndex === index ? "Đang xử lý..." : "Nhận việc"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal chi tiết công việc */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
              onClick={closeModal}
            >
              ×
            </button>

            {modalLoading ? (
              <div className="text-center py-20">Đang tải chi tiết...</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">{selectedJob.position}</h2>
                <p className="text-gray-600 mb-1"><strong>Công ty:</strong> {selectedJob.company}</p>
                <p className="text-gray-600 mb-1"><strong>Lương:</strong> {selectedJob.salary} VNĐ</p>
                <p className="text-gray-600 mb-1"><strong>Mô tả:</strong> {selectedJob.description || "Không có mô tả"}</p>
                <p className="text-gray-600 mb-1"><strong>Yêu cầu:</strong> {selectedJob.requirements || "Không có thông tin"}</p>

                {!selectedJob.hasAccepted && (
                  <button
                    className="mt-4 px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
                    onClick={() => handleAcceptWork(selectedJob)}
                    disabled={modalLoading}
                  >
                    {modalLoading ? "Đang xử lý..." : "Nhận việc"}
                  </button>
                )}

                {selectedJob.hasAccepted && (
                  <span className="mt-4 inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full">
                    Bạn đã nhận việc này
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      {(role === "ROLE_MANAGER" || role === "ROLE_ADMIN") && (
        <button
          onClick={handleManagerClick}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-tr from-blue-500 to-purple-500 hover:scale-110 transition-transform"
        >
          WW
        </button>
      )}

      {role === "ROLE_ADMIN" && (
        <button
          onClick={handleAdminClick}
          className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-tr from-red-500 to-pink-500 hover:scale-110 transition-transform"
        >
          AD
        </button>
      )}
    </div>
  );
}
